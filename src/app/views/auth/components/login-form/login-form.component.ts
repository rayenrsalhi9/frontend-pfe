import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonError } from "@app/core/error-handler/common-error";
import { SecurityService } from "@app/core/security/security.service";
import { UserAuth } from "@app/shared/enums/user-auth";

export function passwordValidator() {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>~\-_=+\[\];'\\\/])(?=.*[0-9]).{8,}$/;
  return Validators.pattern(passwordRegex);
}

@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  formGroup: FormGroup;
  showPassword = false;
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;
  hasSubmissionError = false;

  @Input() thirPartyLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private securityService: SecurityService,
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, Validators.minLength(8), passwordValidator()],
      ],
    });
  }

  login() {
    this.submitted = true;
    this.errorMessage = null;
    this.hasSubmissionError = false;

    Object.keys(this.formGroup.controls).forEach((key) => {
      this.formGroup.get(key)?.markAsTouched();
    });

    if (this.formGroup.invalid) {
      return;
    }

    this.isLoading = true;

    const userObject = {
      email: this.formGroup.value.email.trim().toLowerCase(),
      password: this.formGroup.value.password,
    };

    this.securityService.login(userObject).subscribe(
      (c: UserAuth) => {
        this.isLoading = false;
        this.hasSubmissionError = false;
        if (this.securityService.hasClaim("dashboard_view_dashboard")) {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/"]);
        }
      },
      (err: CommonError) => {
        this.isLoading = false;
        if (err.code === 401) {
          this.errorMessage = "SIGN.IN.ERROR_INVALID_CREDENTIALS";
        } else {
          this.errorMessage = err.error?.["message"] || "SIGN.IN.ERROR_GENERIC";
        }
        this.hasSubmissionError = true;
      },
    );
  }

  onShowPasswordClick() {
    this.showPassword = !this.showPassword;
  }

  onReset() {
    this.formGroup.reset();
    this.errorMessage = null;
    this.hasSubmissionError = false;
  }

  onFieldChange() {
    if (this.hasSubmissionError) {
      this.hasSubmissionError = false;
      this.errorMessage = null;
    }
  }
}
