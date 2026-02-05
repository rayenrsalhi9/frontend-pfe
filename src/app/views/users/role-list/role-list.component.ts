import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { Role } from '@app/shared/enums/role';
import { CommonService } from '@app/shared/services/common.service';
import { RoleService } from '@app/shared/services/role.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  showMobilePanel = false

  rows = [];
  selected = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  bsModalRef: BsModalRef;

  constructor(
    private commonService:CommonService,
    private cdr:ChangeDetectorRef,
    private toastrService:ToastrService,
    private roleService: RoleService,
    private modalService: BsModalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getRoles()
   }

  getRoles(): void {
    this.commonService.getRoles().subscribe(
      (res:any)=>{
        this.rows = res
        this.cdr.detectChanges()
      },
      err=>{
        console.log(err);
      }
    )
  }

  deleteRole(role: Role) {

    this.translate.get('USERS.DELETE.LABEL').subscribe((translations) => {
      this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
        initialState: {
          title: translations.title,
          message: translations.message,
          button: {
            cancel: translations.button.cancel,
            confirm: translations.button.confirm
          }
        }
      });
    }); 
    this.bsModalRef.content.onClose.subscribe(result => {

      if(result) {
        this.roleService.deleteRole(role.id).subscribe(() => {
          this.translate.get('ROLES.TOAST.ROLE_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          }); 
          this.getRoles();
        });
      }

    })

  }

  ngAfterViewInit() {
    this.cellOverflowVisible();
  }

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName('datatable-body-cell overflow-visible');
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute('style', 'overflow: visible !important');
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

}
