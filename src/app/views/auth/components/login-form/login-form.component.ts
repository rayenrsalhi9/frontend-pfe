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
    showPassword = false
    submitted = false
    isLoading = false
    errorMessage: string | null = null

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
        this.errorMessage = null;
        
        // Mark all fields as touched to trigger validation only on submit
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });

        if (this.formGroup.invalid) {
            return;
        }

        this.isLoading = true;

        const userObject = {
          email: this.formGroup.value.username,
          password: this.formGroup.value.password,
        };

        this.securityService.login(userObject).subscribe(
          (c: UserAuth) => {
            this.isLoading = false;
            if (this.securityService.hasClaim('dashboard_view_dashboard')) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          },
          (err: CommonError) => {
            this.isLoading = false;
            this.errorMessage = err.error?.['message'] || 'SIGN.IN.ERROR_GENERIC';
            this.toastr.error(this.errorMessage);
          }
        );
    }

    onShowPasswordClick () {
        this.showPassword = !this.showPassword
    }

    onReset() {
        this.formGroup.reset();
        this.errorMessage = null;
    }
}
