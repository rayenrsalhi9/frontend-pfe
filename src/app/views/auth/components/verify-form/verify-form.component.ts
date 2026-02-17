import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonError } from '@app/core/error-handler/common-error';
import { SecurityService } from '@app/core/security/security.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'verify-form',
  templateUrl: './verify-form.component.html',
})

export class VerifyFormComponent implements OnInit {

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
      email:['',[Validators.required, Validators.email]],
      token:['',[Validators.required]]
    });

    this.activeRoute.paramMap.subscribe(async params => {
      let email = params.get('email')
      this.formGroup.patchValue({
        email:email
      })
    })
  }

  login() {
    const userObject = {
      email: this.formGroup.value.email,
      token: this.formGroup.value.token,
    };

    console.log(userObject);


    this.securityService.verify(userObject).subscribe(
      (data: any) => {
        this.toastr.success('Token valid');
        console.log(data);

        this.router.navigate([`/reset/${data.token}/${this.formGroup.value.email}`])

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
