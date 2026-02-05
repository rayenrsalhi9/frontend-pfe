import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonError } from '@app/core/error-handler/common-error';
import { User } from '@app/shared/enums/user';
import { CommonService } from '@app/shared/services/common.service';
import { UserService } from '@app/shared/services/user.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserPasswordEditComponent } from '../user-password-edit/user-password-edit.component';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  showMobilePanel = false
  users: User[] = [];
  rows:any[] = [];
  selected = [];

  bsModalRef: BsModalRef;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  isLoadingResults = false;
  constructor(
    private userService:UserService,
    private commonService: CommonService,
    private cdr:ChangeDetectorRef,
    private toastrService:ToastrService,
    private router:Router,
    private modalService: BsModalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getUsers()
   }

  deleteUser(user: User) {

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
        this.userService
          .deleteUser(user.id)
          .subscribe(() => {
            this.translate.get('USERS.DELETE.TOAST.USER_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
                    this.toastrService.success(translatedMessage); 
            });  
            this.getUsers();
          });
      }

    })

  }

  getUsers(): void {
    this.isLoadingResults = true;
    this.commonService.getUsers().subscribe(
      (data: any) => {
        this.isLoadingResults = false;
        this.rows = data;
        this.cdr.detectChanges();
      },
      (err: CommonError) => {
        err.messages.forEach((msg) => {
          this.toastrService.error(msg);
          this.isLoadingResults = false;
          this.cdr.detectChanges();
        });
      }
    );
  }

  resetPassword(user: User): void {

    const initialState = {
      data: Object.assign({}, user),
    }

    this.modalService.show(UserPasswordEditComponent,{initialState})
    /* this.dialog.open(ResetPasswordComponent, {
      width: '350px',
    }); */
  }

  editUser(userId: string) {
    this.router.navigate(['/user/user-edit', userId]);
  }
  userPermission(userId: string) {
    //this.router.navigate(['/users/permission', userId]);
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
