import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { DocumentPermission } from '@app/shared/enums/document-permission';
import { DocumentRolePermission } from '@app/shared/enums/document-role-permission';
import { DocumentUserPermission } from '@app/shared/enums/document-user-permission';
import { Role } from '@app/shared/enums/role';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentPermissionService } from '@app/shared/services/document-permission.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-document-share',
  templateUrl: './document-share.component.html',
  styleUrls: ['./document-share.component.css']
})
export class DocumentShareComponent implements OnInit {

  width: any;
  height: any;
  maxHeight: any;
  panelClass: any;
  data: any;

  documentPermissions: DocumentPermission[] = [];
  document: DocumentInfo;
  users: User[] = [];
  roles: Role[] = [];

  constructor(
    private documentPermissionService: DocumentPermissionService,
    private route: ActivatedRoute,
    //private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.document = this.data
    this.getUsers();
    this.getRoles();

    /* this.route.params.subscribe(() => {
      this.getDocumentPrmission();
      this.getUsers();
      this.getRoles();
    }); */
  }

  getDocumentPrmission() {
    this.documentPermissionService
      .getDoucmentPermission(this.document.id)
      .subscribe((permission: DocumentPermission[]) => {
        this.documentPermissions = permission;
        /* this.permissionsDataSource = new MatTableDataSource(
          this.documentPermissions
        );
        this.permissionsDataSource.paginator = this.userPermissionsPaginator; */
      });
  }

  getUsers() {
    this.commonService
      .getUsersForDropdown()
      .subscribe((users: User[]) => (this.users = users));
  }

  getRoles() {
    this.commonService
      .getRolesForDropdown()
      .subscribe((roles: Role[]) => (this.roles = roles));
  }

  deleteDocumentUserPermission(permission: DocumentUserPermission) {
    this.documentPermissionService
      .deleteDocumentUserPermission(permission.id)
      .subscribe(() => {
        this.translate.get('DOCUMENTS.SHARE.TOAST.PERMISSION_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage); 
        });
        this.getDocumentPrmission();
      });
  }

  deleteDocumentRolePermission(permission: DocumentRolePermission) {
    this.documentPermissionService
      .deleteDocumentRolePermission(permission.id)
      .subscribe(() => {
        this.translate.get('DOCUMENTS.SHARE.TOAST.PERMISSION_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage); 
        });
        this.getDocumentPrmission();
      });
  }

  /* addDocumentUserPermission(): void {
    const dialogRef = this.dialog.open(ManageUserPermissionComponent, {
      width: '600px',
      data: Object.assign({ users: this.users, documentId: this.document.id }),
    });
    dialogRef.afterClosed().subscribe((result: Screen) => {
      if (result) {
        this.getDocumentPrmission();
      }
    });
  }

  addDocumentRolePermission(): void {
    const dialogRef = this.dialog.open(ManageRolePermissionComponent, {
      width: '600px',
      data: Object.assign({ roles: this.roles, documentId: this.document.id }),
    });

    dialogRef.afterClosed().subscribe((result: Screen) => {
      if (result) {
        this.getDocumentPrmission();
      }
    });
  } */

  applyPermissionFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    const userPermissions = this.documentPermissions.filter(
      (d: any) =>
        (d.type == 'User' &&
          (d.user.firstName.toLocaleLowerCase().includes(filterValue) ||
            d.user.lastName.toLocaleLowerCase().includes(filterValue) ||
            d.user.email.toLocaleLowerCase().includes(filterValue))) ||
        (d.type == 'Role' &&
          d.role.name.toLocaleLowerCase().includes(filterValue))
    );

  }

  closeDialog() {
    this.bsModalRef.hide();
  }

}
