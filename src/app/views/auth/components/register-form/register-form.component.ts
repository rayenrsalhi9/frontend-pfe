import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';

@Component({
    selector: 'register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
    formGroup: FormGroup;
    submitted = false;
    isLoading = false;
    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private formBuilder: FormBuilder,
        private securityService: SecurityService,
        private router: Router
    ) {}

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            username: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator = (group: FormGroup): { [s: string]: boolean } => {
        const password = group.get('password');
        const confirmPassword = group.get('confirmPassword');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { mismatch: true };
        }
        // Angular validators must return null to indicate "no errors." Returning {} (a truthy, non-null object) causes Angular to treat the form group as always invalid, even when the passwords match. This will block form submission.
        return null;
    };

    // register() {
    //     this.submitted = true;
        
    //     if (this.formGroup.invalid) {
    //         return;
    //     }

    //     this.isLoading = true;
        
    //     const { confirmPassword, ...registerData } = this.formGroup.value;
        
    //     this.securityService.register(registerData).subscribe({
    //         next: () => {
    //             this.router.navigate(['/login']);
    //         },
    //         error: () => {
    //             this.isLoading = false;
    //         }
    //     });
    // }

    onShowPasswordClick() {
        this.showPassword = !this.showPassword;
    }

    onShowConfirmPasswordClick() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}
