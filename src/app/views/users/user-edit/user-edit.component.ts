import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '@app/shared/enums/role';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { UserService } from '@app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  userForm: FormGroup;
  roleList: Role[];
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private cdr:ChangeDetectorRef,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createUserForm();
    this.getRoles()
    this.activeRoute.paramMap.subscribe(params => {
      let id = params.get('id')
      this.userService.getUser(id).subscribe(
        (data:any)=>{
          this.isEditMode = true;
          this.userForm.patchValue({
            ...data,
            roleIds:data.userRoles.map((role) => {
              return role.roleId;
            })
          });

          this.cdr.markForCheck()
        }
      )

    })
    this.cdr.detectChanges()
  }


  createUserForm() {
    this.userForm = this.fb.group(
      {
        id: [''],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        password: [''],
        confirmPassword: [''],
        roleIds:[[]]
      },
      {
        validator: this.checkPasswords,
      }
    );
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  saveUser() {
    if (this.userForm.valid) {
      const user = this.createBuildObject();
      if (this.isEditMode) {
        this.userService.updateUser(user).subscribe(() => {
          this.translate.get('USERS.ADD.TOAST.USER_UPDATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          }); 
          this.router.navigate(['/user/list']);
        });
      } else {
        this.userService.addUser(user).subscribe(() => {
          this.translate.get('USERS.ADD.TOAST.ADDED_SUCCESS').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          }); 
          this.router.navigate(['/user/list']);
        });
      }
    } else {
      this.translate.get('USERS.ADD.TOAST.PLEASE_ENTER_PROPER_DATA').subscribe((translatedMessage: string) => {
        this.toastrService.success(translatedMessage); 
      }); 
    }
  }

  createBuildObject(): User {
    const user: User = {
      id: this.userForm.get('id').value,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value,
      password: this.userForm.get('password').value,
      userName: this.userForm.get('email').value,
      roleIds: this.userForm.get('roleIds').value,
    };
    return user;
  }

  getRoles() {
    this.commonService
      .getRolesForDropdown()
      .subscribe((roles: Role[]) => {
        this.roleList = roles;
      });
  }

}
