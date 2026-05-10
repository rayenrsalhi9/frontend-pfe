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
  styleUrls: ["../forgot-form/forgot-form.component.css"],
})
export class VerifyFormComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;
  errorMessage: string | null = null;

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
      token: ["", [Validators.required]],
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
      email: this.formGroup.value.email.trim().toLowerCase(),
      token: this.formGroup.value.token,
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
    this.formGroup.reset();
    this.submitted = false;
    this.errorMessage = null;
  }
}
