import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { UserService } from "@app/shared/services/user.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { UserAddComponent } from "./user-add.component";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslatePipeMock } from "@app/testing/mock.pipe";

describe("UserAddComponent", () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let activatedRouteStub: any;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  const validPassword = "Test@1234";

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj("UserService", [
      "addUser",
      "getUser",
      "updateUser",
    ]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    toastrSpy = jasmine.createSpyObj("ToastrService", [
      "success",
      "error",
      "warning",
    ]);
    translateSpy = jasmine.createSpyObj("TranslateService", ["instant"]);
    cdrSpy = jasmine.createSpyObj("ChangeDetectorRef", ["markForCheck"]);
    activatedRouteStub = { paramMap: of({ get: () => null }) };

    translateSpy.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      declarations: [UserAddComponent, TranslatePipeMock],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("form initialization", () => {
    it("should have all required form controls", () => {
      expect(component.userForm.get("firstName")).toBeTruthy();
      expect(component.userForm.get("lastName")).toBeTruthy();
      expect(component.userForm.get("email")).toBeTruthy();
      expect(component.userForm.get("phoneNumber")).toBeTruthy();
      expect(component.userForm.get("password")).toBeTruthy();
      expect(component.userForm.get("confirmPassword")).toBeTruthy();
      expect(component.userForm.get("direction")).toBeTruthy();
    });

    it("should be invalid when required fields are empty", () => {
      expect(component.userForm.valid).toBeFalse();
    });
  });

  describe("email validation", () => {
    it("should be invalid when email is empty", () => {
      const email = component.userForm.get("email");
      email?.setValue("");
      expect(email?.valid).toBeFalse();
      expect(email?.errors?.["required"]).toBeTruthy();
    });

    it("should be invalid with malformed email", () => {
      const email = component.userForm.get("email");
      email?.setValue("notanemail");
      expect(email?.valid).toBeFalse();
      expect(email?.errors?.["email"]).toBeTruthy();
    });

    it("should be valid with correct email format", () => {
      const email = component.userForm.get("email");
      email?.setValue("test@example.com");
      expect(email?.valid).toBeTrue();
    });
  });

  describe("password validation in add mode", () => {
    beforeEach(() => {
      component.isEdit = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("should require password in add mode", () => {
      const password = component.userForm.get("password");
      expect(password?.validator).toBeTruthy();
    });

    it("should be invalid without uppercase letter", () => {
      const password = component.userForm.get("password");
      password?.setValue("test@1234");
      expect(password?.valid).toBeFalse();
    });

    it("should be invalid without special character", () => {
      const password = component.userForm.get("password");
      password?.setValue("TestA1234");
      expect(password?.valid).toBeFalse();
    });

    it("should be invalid without number", () => {
      const password = component.userForm.get("password");
      password?.setValue("Test@abcd");
      expect(password?.valid).toBeFalse();
    });

    it("should be invalid with less than 8 characters", () => {
      const password = component.userForm.get("password");
      password?.setValue("Te@1");
      expect(password?.valid).toBeFalse();
    });

    it("should be valid with all password requirements met", () => {
      const password = component.userForm.get("password");
      password?.setValue(validPassword);
      expect(password?.valid).toBeTrue();
    });

    it("should show mismatch error when passwords do not match", () => {
      component.userForm.get("password")?.setValue(validPassword);
      component.userForm.get("confirmPassword")?.setValue("Different@123");
      component.isSubmitted = true;
      fixture.detectChanges();

      expect(component.isPasswordsNotMatch).toBeTrue();
    });
  });

  describe("password not required in edit mode", () => {
    it("should clear password validators in edit mode", () => {
      userServiceSpy.getUser.and.returnValue(of({ id: "123" }));
      const editParamMap = of({ get: (key: string) => key === "id" ? "123" : null });
      activatedRouteStub.paramMap = editParamMap;
      component.isEdit = true;
      component.ngOnInit();
      fixture.detectChanges();

      const password = component.userForm.get("password");
      expect(password?.validator).toBeNull();
    });
  });

  describe("email sanitization", () => {
    it("should trim and lowercase email in prepareFormData", () => {
      component.userForm.patchValue({
        firstName: "John",
        lastName: "Doe",
        email: "  Test@Example.COM  ",
        phoneNumber: "1234567890",
        password: validPassword,
        confirmPassword: validPassword,
      });

      const formData = (component as any).prepareFormData();
      expect(formData.email).toBe("test@example.com");
    });
  });

  describe("cancel button", () => {
    it("should navigate to user list", () => {
      component.onCancel();
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/user/list"]);
    });

    it("should reset form on cancel", () => {
      component.userForm.patchValue({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      });
      component.isSubmitted = true;

      component.onCancel();

      expect(component.userForm.get("firstName")?.value).toBeFalsy();
      expect(component.isSubmitted).toBeFalse();
    });
  });

  describe("submit button", () => {
    beforeEach(() => {
      component.isEdit = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("should be disabled when form is invalid", () => {
      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      );
      expect(button.disabled).toBeTrue();
    });

    it("should hide form when isLoading is true", () => {
      component.isLoading = true;
      fixture.detectChanges();
      const form = fixture.nativeElement.querySelector("#userForm");
      expect(form).toBeFalsy();
    });
  });

  describe("user creation", () => {
    beforeEach(() => {
      component.isEdit = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("should call addUser and navigate on success", fakeAsync(() => {
      userServiceSpy.addUser.and.returnValue(of({ id: "1" }));

      component.userForm.patchValue({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        direction: "IT",
        password: validPassword,
        confirmPassword: validPassword,
      });

      component.onSubmit();
      tick();

      expect(userServiceSpy.addUser).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/user/list"]);
      expect(toastrSpy.success).toHaveBeenCalled();
    }));

    it("should show error toast on failed creation", fakeAsync(() => {
      userServiceSpy.addUser.and.returnValue(
        throwError(() => ({ status: 422 })),
      );

      component.userForm.patchValue({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        password: validPassword,
        confirmPassword: validPassword,
      });

      component.onSubmit();
      tick();

      expect(toastrSpy.error).toHaveBeenCalled();
    }));

    it("should not submit if form is invalid", () => {
      component.onSubmit();
      expect(userServiceSpy.addUser).not.toHaveBeenCalled();
    });
  });

  describe("error message getters", () => {
    it("should return required error messages for empty fields", () => {
      component.isSubmitted = true;

      expect(component.firstNameErrorMessage).toBe(
        "ADD.USER.ERRORS.FIRST_NAME_REQUIRED",
      );
      expect(component.lastNameErrorMessage).toBe(
        "ADD.USER.ERRORS.LAST_NAME_REQUIRED",
      );
      expect(component.emailErrorMessage).toBe(
        "ADD.USER.ERRORS.EMAIL_REQUIRED",
      );
      expect(component.phoneNumberErrorMessage).toBe(
        "ADD.USER.ERRORS.MOBILE_REQUIRED",
      );
    });

    it("should return email invalid error for bad email", () => {
      component.userForm.get("email")?.setValue("notanemail");
      component.userForm.get("email")?.markAsTouched();
      component.isSubmitted = true;

      expect(component.emailErrorMessage).toBe("ADD.USER.ERRORS.EMAIL_INVALID");
    });

    it("should return password minlength error for short password", () => {
      component.isEdit = false;
      component.ngOnInit();
      component.userForm.get("password")?.setValue("weak");
      component.userForm.get("password")?.markAsTouched();
      component.isSubmitted = true;

      expect(component.passwordErrorMessage).toBe(
        "ADD.USER.VALIDATION.PASSWORD_MIN_LENGTH",
      );
    });
  });

  describe("validation flag getters", () => {
    it("isEmailInvalid should return true when email is invalid and touched", () => {
      const email = component.userForm.get("email");
      email?.setValue("bad");
      email?.markAsTouched();
      component.isSubmitted = true;
      fixture.detectChanges();

      expect(component.isEmailInvalid).toBeTrue();
    });

    it("isPasswordInvalid should return true when password is invalid and touched", () => {
      component.userForm.get("password")?.setValue("weak");
      component.userForm.get("password")?.markAsTouched();
      component.isSubmitted = true;

      expect(component.isPasswordInvalid).toBeTrue();
    });
  });
});
