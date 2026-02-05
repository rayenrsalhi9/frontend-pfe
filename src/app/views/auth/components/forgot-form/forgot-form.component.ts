import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonError } from '@app/core/error-handler/common-error';
import { SecurityService } from '@app/core/security/security.service';
import { UserAuth } from '@app/shared/enums/user-auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'forgot-form',
  templateUrl: './forgot-form.component.html'
})
export class ForgotFormComponent implements OnInit {

  formGroup: FormGroup;
  showResult = false
  showPassword = false

  @Input() thirPartyLogin = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private securityService: SecurityService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email:['',[Validators.required, Validators.email]]
    });
  }

  login() {
    const userObject = {
      email: this.formGroup.value.email,
    };

    console.log(userObject);


    this.securityService.forgot(userObject).subscribe(
      (c: UserAuth) => {
        this.toastr.success('Email sent successfully.');
        this.router.navigate(['/verify/'+this.formGroup.value.email])
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
