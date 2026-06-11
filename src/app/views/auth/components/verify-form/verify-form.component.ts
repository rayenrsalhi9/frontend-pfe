import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonError } from "@app/core/error-handler/common-error";
import { SecurityService } from "@app/core/security/security.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "verify-form",
  templateUrl: "./verify-form.component.html",
  styleUrls: ["../login-form/login-form.component.css"],
})
export class VerifyFormComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;
  otpDigits: string[] = ["", "", "", "", "", ""];

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
    this.formGroup = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });

    this.activeRoute.paramMap.subscribe(async (params) => {
      let email = params.get("email");
      if (email) {
        this.formGroup.patchValue({
          email: decodeURIComponent(email),
        });
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  onOtpInput(event: any, index: number): void {
    const value = event.target.value;
    if (value && !/^\d$/.test(value)) {
      event.target.value = "";
      return;
    }
    this.otpDigits[index] = value;
    if (value && index < 5) {
      const nextInput = document.querySelectorAll(".otp-input")[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  get hasEmptyDigit(): boolean {
    return this.otpDigits.some(d => d === '');
  }

  onOtpKeydown(event: any, index: number): void {
    if (event.key === "Backspace" && !this.otpDigits[index] && index > 0) {
      const prevInput = document.querySelectorAll(".otp-input")[index - 1] as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData("text") || "";
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, 6);
    const inputs = document.querySelectorAll(".otp-input");

    this.otpDigits = ["", "", "", "", "", ""];
    inputs.forEach((input) => {
      (input as HTMLInputElement).value = "";
    });

    digits.forEach((digit, i) => {
      this.otpDigits[i] = digit;
      if (inputs[i]) {
        (inputs[i] as HTMLInputElement).value = digit;
      }
    });
    const nextIndex = digits.length < 6 ? digits.length : 5;
    if (inputs[nextIndex]) {
      (inputs[nextIndex] as HTMLInputElement).focus();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.otpDigits.some((d) => d === "")) {
      return;
    }

    this.isLoading = true;

    const userObject = {
      email: this.formGroup.value.email.trim().toLowerCase(),
      token: this.otpDigits.join(""),
    };

    this.securityService.verify(userObject).subscribe(
      (data: any) => {
        this.isLoading = false;
        this.toastr.success(this.translate.instant("SIGN.VERIFY.SUCCESS"));
        this.router.navigate([
          `/reset/${data.token}/${encodeURIComponent(this.formGroup.value.email)}`,
        ]);
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

  onReset() {
    this.otpDigits = ["", "", "", "", "", ""];
    this.formGroup.reset();
    this.submitted = false;
    this.errorMessage = null;
  }
}
