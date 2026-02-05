import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { UserAuth, User } from '@app/shared/enums/user-auth';
import { CompanyProfileService } from '@app/shared/services/company-profile.service';
import { UserService } from '@app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userForm: FormGroup;
  user: UserAuth;
  avatar: SafeUrl
  newPicture: string = null
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private securityService: SecurityService,
    private companyProfileService: CompanyProfileService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private translate: TranslateService
  ) {
  }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.createUserForm();
    this.user = this.securityService.getUserDetail();

    if (this.user) {
      this.userForm.patchValue(this.user.user);
      this.avatar = this.user.user.avatar ? (this.user.user.avatar.startsWith("data:image") ? this.user.user.avatar : this.getHost() + this.user.user.avatar) : null
      this.cdr.markForCheck()
    }
    this.cdr.detectChanges()
  }

  createUserForm() {
    this.userForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      avatar: ['', []],
    });
  }

  updateProfile() {
    if (this.userForm.valid) {
      const user = this.createBuildObject();
      this.userService
        .updateUserProfile(user)
        .subscribe((userData: any) => {
          this.userService.refreshUser(user)

          this.user.user.firstName = user.firstName;
          this.user.user.lastName = user.lastName;
          this.user.user.phoneNumber = user.phoneNumber;
          this.user.user.avatar = user.avatar
          this.translate.get('PROFILE_SETTING.TOAST.PROFILE_UPDATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          }); 
          this.securityService.setUserDetail(this.user);
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onFileSelect(event) {
    const fileSelected: File = event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    reader.onload = (_event) => {
      this.avatar = reader.result;
      this.userForm.patchValue({
        avatar: reader.result.toString()
      })
      this.newPicture = reader.result.toString()
      this.cdr.detectChanges()
    }

  }

  createBuildObject(): User {
    const user: User = {
      id: this.userForm.get('id').value,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value,
      userName: this.userForm.get('email').value,
      avatar: this.avatar
    };
    return user;
  }

  /* changePassword(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '350px',
      data: Object.assign({}, this.user),
    });
  } */

}
