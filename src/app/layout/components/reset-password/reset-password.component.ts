import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SecurityService } from '@app/core/security/security.service';
import { UserService } from '@app/shared/services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

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
        oldPassword: ['', [Validators.required]],
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
        .changePassword(this.createBuildObject())
        .subscribe((d) => {
          this.translate.get('PROFILE_SETTING.PASSWORD.TOAST.SUCCESSFULLY_CHANGED_PASSWORD').subscribe((translatedMessage: string) => {
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
      newPassword: this.changePasswordForm.get('password').value,
      oldPassword: this.changePasswordForm.get('oldPassword').value,
      userName: this.changePasswordForm.get('email').value,
    };
  }

  onNoClick(): void {
    this.bsModalRef.hide();
  }

}
