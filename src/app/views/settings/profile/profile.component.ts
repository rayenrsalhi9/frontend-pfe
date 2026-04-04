import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { UserAuth } from "@app/shared/enums/user-auth";
import { UserService } from "@app/shared/services/user.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  user: UserAuth | null = null;
  avatar: string | null = null;
  newPicture: string | null = null;
  isLoading = false;
  isSubmitted = false;

  private destroy$ = new Subject<void>();

  get hostBase(): string {
    return environment.apiUrl;
  }

  get firstNameControl() {
    return this.userForm.get("firstName");
  }

  get lastNameControl() {
    return this.userForm.get("lastName");
  }

  get phoneNumberControl() {
    return this.userForm.get("phoneNumber");
  }

  get emailControl() {
    return this.userForm.get("email");
  }

  get isFirstNameInvalid(): boolean {
    const control = this.firstNameControl;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || this.isSubmitted)
    );
  }

  get isLastNameInvalid(): boolean {
    const control = this.lastNameControl;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || this.isSubmitted)
    );
  }

  get isPhoneNumberInvalid(): boolean {
    const control = this.phoneNumberControl;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || this.isSubmitted)
    );
  }

  get firstNameErrorMessage(): string {
    const control = this.firstNameControl;
    if (control?.errors?.["required"]) {
      return "PROFILE_SETTING.ERROR.FIRST_NAME_IS_REQUIRED";
    }
    return "";
  }

  get lastNameErrorMessage(): string {
    const control = this.lastNameControl;
    if (control?.errors?.["required"]) {
      return "PROFILE_SETTING.ERROR.LAST_NAME_IS_REQUIRED";
    }
    return "";
  }

  get phoneNumberErrorMessage(): string {
    const control = this.phoneNumberControl;
    if (control?.errors?.["required"]) {
      return "PROFILE_SETTING.ERROR.MOBILE_IS_REQUIRED";
    }
    return "";
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.createUserForm();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createUserForm(): void {
    this.userForm = this.fb.group({
      id: [""],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: [
        { value: "", disabled: true },
        [Validators.required, Validators.email],
      ],
      phoneNumber: ["", [Validators.required]],
      avatar: [""],
    });
  }

  private loadUserData(): void {
    this.isLoading = true;
    const userAuth = this.securityService.getUserDetail();

    if (!userAuth) {
      this.isLoading = false;
      this.toastrService.error(
        this.translate.instant("PROFILE_SETTING.ERROR.LOAD_FAILED"),
      );
      this.cdr.markForCheck();
      return;
    }

    this.user = userAuth;
    const userData = userAuth.user;

    this.userForm.patchValue({
      id: userData.id,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
    });

    this.avatar = userData?.avatar
      ? userData.avatar.startsWith("data:image")
        ? userData.avatar
        : this.hostBase + userData.avatar
      : null;

    this.isLoading = false;
    this.cdr.markForCheck();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      this.toastrService.error(
        this.translate.instant("PROFILE_SETTING.ERROR.INVALID_IMAGE_TYPE"),
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastrService.error(
        this.translate.instant("PROFILE_SETTING.ERROR.FILE_TOO_LARGE"),
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.newPicture = reader.result as string;
      this.userForm.patchValue({ avatar: this.newPicture });
      this.cdr.markForCheck();
    };
    reader.onerror = () => {
      this.toastrService.error(
        this.translate.instant("PROFILE_SETTING.ERROR.READ_FAILED"),
      );
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
    input.value = "";
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastrService.warning(
        this.translate.instant("PROFILE_SETTING.ERROR.VALIDATION_ERROR"),
      );
      return;
    }

    this.isLoading = true;
    const userData = this.prepareFormData();

    this.userService
      .updateUserProfile(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response?.id) {
            this.updateLocalUser(response);
            this.toastrService.success(
              this.translate.instant(
                "PROFILE_SETTING.TOAST.PROFILE_UPDATED_SUCCESSFULLY",
              ),
            );
            this.cdr.markForCheck();
          } else {
            this.toastrService.error(
              response?.friendlyMessage ||
                this.translate.instant("PROFILE_SETTING.ERROR.UPDATE_FAILED"),
            );
            this.cdr.markForCheck();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastrService.error(
            this.translate.instant("PROFILE_SETTING.ERROR.UPDATE_FAILED"),
          );
          this.cdr.markForCheck();
        },
      });
  }

  private prepareFormData(): any {
    const formValue = this.userForm.getRawValue();
    return {
      id: formValue.id,
      firstName: (formValue.firstName || "").trim(),
      lastName: (formValue.lastName || "").trim(),
      phoneNumber: (formValue.phoneNumber || "").trim(),
      userName: formValue.email,
      avatar: this.newPicture || this.avatar || null,
    };
  }

  private updateLocalUser(userData: any): void {
    if (!this.user) return;

    this.user.user.firstName = userData.firstName;
    this.user.user.lastName = userData.lastName;
    this.user.user.phoneNumber = userData.phoneNumber;
    this.user.user.avatar = userData.avatar;

    this.avatar = userData.avatar;
    this.newPicture = null;

    this.securityService.setUserDetail(this.user);
  }

  onCancel(): void {
    this.router.navigate(["/dashboard"]);
  }
}
