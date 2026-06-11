import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonError } from "@app/core/error-handler/common-error";
import { SecurityService } from "@app/core/security/security.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

export function passwordValidator() {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>~\-_=+\[\];'\\\/])(?=.*[0-9]).{8,}$/;
  return Validators.pattern(passwordRegex);
}

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["../login-form/login-form.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  @Input() thirPartyLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [Validators.required, Validators.minLength(8), passwordValidator()],
        ],
        confirmPassword: ["", [Validators.required]],
        token: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

    this.activeRoute.paramMap.subscribe(async (params) => {
      let token = params.get("token");
      let email = params.get("email");
      if (token && email) {
        this.formGroup.patchValue({
          email: decodeURIComponent(email),
          token: token,
        });
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  passwordMatchValidator = (group: FormGroup): { [s: string]: boolean } => {
    const password = group.get("password");
    const confirmPassword = group.get("confirmPassword");
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { mismatch: true };
    }
    return null;
  };

  hasUpperCase(value: string): boolean {
    return /[A-Z]/.test(value);
  }

  hasSpecialChar(value: string): boolean {
    return /[!@#$%^&*(),.?":{}|<>~\-_=+\[\];'\\\/]/.test(value);
  }

  hasNumber(value: string): boolean {
    return /[0-9]/.test(value);
  }

  hasMinLength(value: string): boolean {
    return value.length >= 8;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    Object.keys(this.formGroup.controls).forEach((key) => {
      this.formGroup.get(key)?.markAsTouched();
    });

    if (this.formGroup.invalid) {
      return;
    }

    this.isLoading = true;

    const userObject = {
      email: this.formGroup.value.email,
      token: this.formGroup.value.token,
      password: this.formGroup.value.password,
    };

    this.securityService.reset(userObject).subscribe(
      (c: any) => {
        this.isLoading = false;
        this.toastr.success(this.translate.instant("SIGN.RESET.SUCCESS"));
        this.router.navigate(["/login"]);
      },
      (err: CommonError) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.["message"] ||
          this.translate.instant("SIGN.IN.ERROR_GENERIC");
        this.toastr.error(this.errorMessage);
      },
    );
  }

  onShowPasswordClick() {
    this.showPassword = !this.showPassword;
  }

  onShowConfirmPasswordClick() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onReset() {
    this.formGroup.reset();
    this.submitted = false;
    this.errorMessage = null;
  }
}
