import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Role } from "@app/shared/enums/role";
import { CommonService } from "@app/shared/services/common.service";
import { UserService } from "@app/shared/services/user.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.scss"],
})
export class UserAddComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  roleList: Role[] = [];
  isLoading = false;
  isEdit = false;
  userId: string | null = null;
  isSubmitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group(
      {
        id: [""],
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        phoneNumber: ["", [Validators.required]],
        direction: [""],
        roles: [[]],
        password: [""],
        confirmPassword: [""],
      },
      {
        validator: UserAddComponent.checkPasswords,
      },
    );
  }

  private static checkPasswords(group: FormGroup): { notSame: boolean } | null {
    const pass = group.get("password")?.value;
    const confirmPass = group.get("confirmPassword")?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  private checkEditMode(): void {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get("id");
        if (id) {
          this.isEdit = true;
          this.userId = id;
          this.userForm.get("email")?.disable();
          this.loadUser(id);
        } else {
          this.addPasswordValidators();
        }
      });
  }

  private addPasswordValidators(): void {
    this.userForm
      .get("password")
      ?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get("confirmPassword")?.setValidators([Validators.required]);
    this.userForm.get("password")?.updateValueAndValidity();
    this.userForm.get("confirmPassword")?.updateValueAndValidity();
  }

  private loadUser(id: string): void {
    this.isLoading = true;
    this.userService
      .getUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          const roleIds = data.userRoles?.map((ur: any) => ur.roleId) || [];
          this.userForm.patchValue({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            direction: data.direction,
            roles: roleIds,
          });
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error loading user:", error);
          this.toastrService.error(this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"));
        },
      });
  }

  private loadRoles(): void {
    this.commonService
      .getRolesForDropdown()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles: Role[]) => {
          this.roleList = roles || [];
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error("Error loading roles:", error);
          this.roleList = [];
          this.toastrService.error(this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR"));
        },
      });
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastrService.warning(this.translate.instant("ADD.SHARED.ERRORS.VALIDATION_ERROR"));
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    if (this.isEdit) {
      this.updateUser(formData);
    } else {
      this.createUser(formData);
    }
  }

  private createUser(formData: any): void {
    this.userService
      .addUser(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastrService.success(this.translate.instant("ADD.USER.TOAST.SUCCESS"));
          this.router.navigate(["/user/list"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error creating user:", error);
          this.toastrService.error(this.translate.instant("ADD.USER.TOAST.ERROR"));
        },
      });
  }

  private updateUser(formData: any): void {
    this.userService
      .updateUser(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastrService.success(this.translate.instant("EDIT.USER.TOAST.SUCCESS"));
          this.router.navigate(["/user/list"]);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error updating user:", error);
          this.toastrService.error(this.translate.instant("EDIT.USER.TOAST.ERROR"));
        },
      });
  }

  private prepareFormData(): any {
    const formValue = this.userForm.getRawValue();
    const normalizedEmail = (formValue.email ?? "").trim().toLowerCase();

    return {
      id: (formValue.id ?? "").trim(),
      firstName: (formValue.firstName ?? "").trim(),
      lastName: (formValue.lastName ?? "").trim(),
      email: normalizedEmail,
      phoneNumber: (formValue.phoneNumber ?? "").trim(),
      password: formValue.password ? formValue.password : null,
      userName: normalizedEmail,
      direction: (formValue.direction ?? "").trim(),
      roleIds: formValue.roles ?? [],
    };
  }

  onCancel(): void {
    this.router.navigate(["/user/list"]);
  }

  get firstNameControl() {
    return this.userForm.get("firstName");
  }

  get lastNameControl() {
    return this.userForm.get("lastName");
  }

  get emailControl() {
    return this.userForm.get("email");
  }

  get phoneNumberControl() {
    return this.userForm.get("phoneNumber");
  }

  get passwordControl() {
    return this.userForm.get("password");
  }

  get confirmPasswordControl() {
    return this.userForm.get("confirmPassword");
  }

  get directionControl() {
    return this.userForm.get("direction");
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

  get isEmailInvalid(): boolean {
    const control = this.emailControl;
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

  get isPasswordInvalid(): boolean {
    const control = this.passwordControl;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || this.isSubmitted)
    );
  }

  get isConfirmPasswordInvalid(): boolean {
    const control = this.confirmPasswordControl;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || this.isSubmitted)
    );
  }

  get isPasswordsNotMatch(): boolean {
    return (
      this.isSubmitted &&
      this.userForm.hasError("notSame") &&
      !!this.passwordControl?.value &&
      !!this.confirmPasswordControl?.value
    );
  }

  get firstNameErrorMessage(): string {
    const control = this.firstNameControl;
    if (control?.errors?.["required"]) {
      return "ADD.USER.ERRORS.FIRST_NAME_REQUIRED";
    }
    return "";
  }

  get lastNameErrorMessage(): string {
    const control = this.lastNameControl;
    if (control?.errors?.["required"]) {
      return "ADD.USER.ERRORS.LAST_NAME_REQUIRED";
    }
    return "";
  }

  get emailErrorMessage(): string {
    const control = this.emailControl;
    if (control?.errors?.["required"]) {
      return "ADD.USER.ERRORS.EMAIL_REQUIRED";
    }
    if (control?.errors?.["email"]) {
      return "ADD.USER.ERRORS.EMAIL_INVALID";
    }
    return "";
  }

  get phoneNumberErrorMessage(): string {
    const control = this.phoneNumberControl;
    if (control?.errors?.["required"]) {
      return "ADD.USER.ERRORS.MOBILE_REQUIRED";
    }
    return "";
  }

  get passwordErrorMessage(): string {
    const control = this.passwordControl;
    if (control?.errors?.["required"]) {
      return "ADD.USER.ERRORS.PASSWORD_REQUIRED";
    }
    if (control?.errors?.["minlength"]) {
      return "ADD.USER.VALIDATION.PASSWORD_MIN_LENGTH";
    }
    return "";
  }

  get confirmPasswordErrorMessage(): string {
    const control = this.confirmPasswordControl;
    if (control?.errors?.["required"]) {
      return "ADD.USER.ERRORS.CONFIRM_PASSWORD_REQUIRED";
    }
    if (this.isPasswordsNotMatch) {
      return "ADD.USER.ERRORS.PASSWORDS_DO_NOT_MATCH";
    }
    return "";
  }
}
