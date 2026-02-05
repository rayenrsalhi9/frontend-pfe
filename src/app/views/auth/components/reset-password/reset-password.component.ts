import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonError } from '@app/core/error-handler/common-error';
import { SecurityService } from '@app/core/security/security.service';
import { UserAuth } from '@app/shared/enums/user-auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  formGroup: FormGroup;
  showResult = false
  showPassword = false

  @Input() thirPartyLogin = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      token: ['', [Validators.required]],
    });

    this.activeRoute.paramMap.subscribe(async params => {
      let token = params.get('token')
      let email = params.get('email')
      if(token && email) {
        this.formGroup.patchValue({
          email: email,
          token: token
        })
      } else {
        this.router.navigate(['/login'])
      }
    })
  }

  login() {
    const userObject = {
      email: this.formGroup.value.email,
      token: this.formGroup.value.token,
      password: this.formGroup.value.password
    };

    console.log(userObject);


    this.securityService.reset(userObject).subscribe(
      (c: UserAuth) => {
        this.toastr.success('Password successfully changed.');
        this.router.navigate(['/login'])
      },
      (err: CommonError) => {
        this.toastr.error(err.error['message']);
      }
    );
  }

  onShowPasswordClick() {
    this.showPassword = !this.showPassword
  }

  onReset() {
    this.formGroup.reset();
  }

}
