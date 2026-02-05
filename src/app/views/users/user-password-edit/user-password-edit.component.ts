import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SecurityService } from '@app/core/security/security.service';
import { UserService } from '@app/shared/services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-user-password-edit',
  templateUrl: './user-password-edit.component.html',
  styleUrls: ['./user-password-edit.component.css']
})
export class UserPasswordEditComponent implements OnInit {

  changePasswordForm: FormGroup;
  data:any

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private securityService: SecurityService,
    public bsModalRef: BsModalRef,
    private cdr:ChangeDetectorRef,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createChangePasswordForm();
    this.changePasswordForm.get('email').setValue(this.data.email);
    this.cdr.detectChanges()
  }

  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group(
      {
        email: [{ value: '', disabled: true }],
        //oldPasswordPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.checkPasswords,
      }
    );
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.userService
        .resetPassword(this.createBuildObject())
        .subscribe((d) => {
          this.translate.get('USERS.PASSWORD.TOAST.SUCCESSFULLY_CHANGED_PASSWORD').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          }); 
          //this.securityService.logout();
          this.bsModalRef.hide();
        });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  createBuildObject() {
    return {
      email: this.changePasswordForm.get('email').value,
      password: this.changePasswordForm.get('password').value,
      userName: this.changePasswordForm.get('email').value,
    };
  }

  onNoClick(): void {
    this.bsModalRef.hide();
  }

}
