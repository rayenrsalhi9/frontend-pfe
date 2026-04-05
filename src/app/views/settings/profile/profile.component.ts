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
import { CommonError } from "@app/shared/enums/common-error";
import { UserService } from "@app/shared/services/user.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

interface UpdateUserProfilePayload {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userName: string;
  email: string;
  avatar: string | null;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

function isCommonError(response: any): response is CommonError {
  return response && typeof response === "object" && "friendlyMessage" in response;
}

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
  avatarPreview: string | null = null;
  newPicture: string | null = null;
  isLoading = false;
  isSubmitting = false;
  isSubmitted = false;

  private destroy$ = new Subject<void>();
  private initialFormValues: ProfileFormValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  get hostBase(): string {
    return environment.apiUrl;
  }

  private buildAvatarPreview(avatar: string | null | undefined): string | null {
    if (!avatar) return null;
    if (avatar.startsWith("data:image")) return avatar;
    if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
    return this.hostBase + avatar;
  }

  get hasChanges(): boolean {
    const current = {
      firstName: this.userForm.get("firstName")?.value || "",
      lastName: this.userForm.get("lastName")?.value || "",
      phoneNumber: this.userForm.get("phoneNumber")?.value || "",
    };
    return (
      this.newPicture !== null ||
      current.firstName !== this.initialFormValues.firstName ||
      current.lastName !== this.initialFormValues.lastName ||
      current.phoneNumber !== this.initialFormValues.phoneNumber
    );
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
      return "PROFILE_SETTING.ERRORS.FIRST_NAME_IS_REQUIRED";
    }
    return "";
  }

  get lastNameErrorMessage(): string {
    const control = this.lastNameControl;
    if (control?.errors?.["required"]) {
      return "PROFILE_SETTING.ERRORS.LAST_NAME_IS_REQUIRED";
    }
    return "";
  }

  get phoneNumberErrorMessage(): string {
    const control = this.phoneNumberControl;
    if (control?.errors?.["required"]) {
      return "PROFILE_SETTING.ERRORS.MOBILE_IS_REQUIRED";
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
        this.translate.instant("PROFILE_SETTING.ERRORS.LOAD_FAILED"),
      );
      this.cdr.markForCheck();
      return;
    }

    this.user = userAuth;
    const userData = userAuth.user ?? {};

    this.userForm.patchValue({
      id: userData.id || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
    });

    this.initialFormValues = {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phoneNumber: userData.phoneNumber || "",
    };

    this.avatar = userData.avatar || null;

    this.avatarPreview = this.buildAvatarPreview(userData.avatar);

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
        this.translate.instant("PROFILE_SETTING.ERRORS.INVALID_IMAGE_TYPE"),
      );
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastrService.error(
        this.translate.instant("PROFILE_SETTING.ERRORS.FILE_TOO_LARGE"),
      );
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.newPicture = reader.result as string;
      this.userForm.patchValue({ avatar: file });
      this.cdr.markForCheck();
    };
    reader.onerror = () => {
      this.toastrService.error(
        this.translate.instant("PROFILE_SETTING.ERRORS.READ_FAILED"),
      );
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
    input.value = "";
  }

  onSubmit(): void {
    this.isSubmitted = true;

    Object.keys(this.userForm.controls).forEach((key) => {
      const value = this.userForm.get(key)?.value;
      if (typeof value === "string") {
        this.userForm.get(key)?.setValue(value.trim());
      }
    });

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastrService.warning(
        this.translate.instant("PROFILE_SETTING.ERRORS.VALIDATION_ERROR"),
      );
      return;
    }

    this.isSubmitting = true;
    this.disableFormForSubmission();
    const userData = this.prepareFormData();

    this.userService
      .updateUserProfile(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.enableFormAfterSubmission();
          if (isCommonError(response)) {
            this.toastrService.error(
              response.friendlyMessage ||
                this.translate.instant("PROFILE_SETTING.ERRORS.UPDATE_FAILED"),
            );
            this.cdr.markForCheck();
          } else {
            this.updateLocalUser(response);
            this.toastrService.success(
              this.translate.instant(
                "PROFILE_SETTING.TOAST.PROFILE_UPDATED_SUCCESSFULLY",
              ),
            );
            this.cdr.markForCheck();
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.enableFormAfterSubmission();
          this.toastrService.error(
            this.translate.instant("PROFILE_SETTING.ERRORS.UPDATE_FAILED"),
          );
          this.cdr.markForCheck();
        },
      });
  }

  private prepareFormData(): UpdateUserProfilePayload {
    const formValue = this.userForm.getRawValue();
    return {
      id: formValue.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNumber: formValue.phoneNumber,
      userName: formValue.email,
      email: formValue.email,
      avatar: this.newPicture || null,
    };
  }

  private updateLocalUser(userData: any): void {
    if (!this.user) return;

    this.user.user = this.user.user ?? {};
    const target = this.user.user;

    target.firstName = userData.firstName;
    target.lastName = userData.lastName;
    target.phoneNumber = userData.phoneNumber;
    target.avatar = userData.avatar;

    this.avatar = userData.avatar;
    this.avatarPreview = this.buildAvatarPreview(userData.avatar);
    this.newPicture = null;

    this.initialFormValues = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
    };

    this.securityService.setUserDetail(this.user);
  }

  private disableFormForSubmission(): void {
    this.userForm.get("firstName")?.disable();
    this.userForm.get("lastName")?.disable();
    this.userForm.get("phoneNumber")?.disable();
  }

  private enableFormAfterSubmission(): void {
    this.userForm.get("firstName")?.enable();
    this.userForm.get("lastName")?.enable();
    this.userForm.get("phoneNumber")?.enable();
    this.emailControl.disable();
  }

  onCancel(): void {
    this.router.navigate(["/dashboard"]);
  }
}
