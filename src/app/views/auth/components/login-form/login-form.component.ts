import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { CommonError } from '@app/core/error-handler/common-error';
import { SecurityService } from '@app/core/security/security.service';
import { UserAuth } from '@app/shared/enums/user-auth';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    formGroup: FormGroup;
    showResult = false
    showPassword = false
    submitted = false

    @Input() thirPartyLogin = false

    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private securityService: SecurityService,
      private toastr:ToastrService,
    ) {}

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            username: ['', [
                Validators.required
            ]],
            password: ['', [
                Validators.required
            ]]
        });
    }

    login() {
        this.submitted = true;
        
        // Mark all fields as touched to trigger validation only on submit
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });

        if (this.formGroup.invalid) {
            return;
        }

        const userObject = {
          email: this.formGroup.value.username,
          password: this.formGroup.value.password,
        };

        this.securityService.login(userObject).subscribe(
          (c: UserAuth) => {
            this.toastr.success('User login successfully.');
            if (this.securityService.hasClaim('dashboard_view_dashboard')) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          },
          (err: CommonError) => {
            this.toastr.error(err.error['message']);
          }
        );
    }

    onShowPasswordClick () {
        this.showPassword = !this.showPassword
    }

    onReset() {
        this.formGroup.reset();
    }
}
