import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DocumentInfo } from "@app/shared/enums/document-info";
import { DocumentPermission } from "@app/shared/enums/document-permission";
import { DocumentRolePermission } from "@app/shared/enums/document-role-permission";
import { DocumentUserPermission } from "@app/shared/enums/document-user-permission";
import { Role } from "@app/shared/enums/role";
import { User } from "@app/shared/enums/user-auth";
import { CommonService } from "@app/shared/services/common.service";
import { DocumentPermissionService } from "@app/shared/services/document-permission.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-document-share",
  templateUrl: "./document-share.component.html",
  styleUrls: ["./document-share.component.css"],
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
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef,
    private commonService: CommonService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.document = this.data;
    this.getUsers();
    this.getRoles();
  }

  getDocumentPrmission() {
    this.documentPermissionService
      .getDocumentPermission(this.document.id)
      .subscribe((permission: DocumentPermission[]) => {
        this.documentPermissions = permission;
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
        this.translate
          .get("DOCUMENTS.SHARE.TOAST.PERMISSION_DELETED_SUCCESSFULLY")
          .subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
        this.getDocumentPrmission();
      });
  }

  deleteDocumentRolePermission(permission: DocumentRolePermission) {
    this.documentPermissionService
      .deleteDocumentRolePermission(permission.id)
      .subscribe(() => {
        this.translate
          .get("DOCUMENTS.SHARE.TOAST.PERMISSION_DELETED_SUCCESSFULLY")
          .subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
        this.getDocumentPrmission();
      });
  }

  applyPermissionFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    const userPermissions = this.documentPermissions.filter(
      (d: any) =>
        (d.type == "User" &&
          (d.user.firstName.toLocaleLowerCase().includes(filterValue) ||
            d.user.lastName.toLocaleLowerCase().includes(filterValue) ||
            d.user.email.toLocaleLowerCase().includes(filterValue))) ||
        (d.type == "Role" &&
          d.role.name.toLocaleLowerCase().includes(filterValue)),
    );
  }

  closeDialog() {
    this.bsModalRef.hide();
  }
}
