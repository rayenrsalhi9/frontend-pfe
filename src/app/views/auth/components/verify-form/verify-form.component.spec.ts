import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SecurityService } from "@app/core/security/security.service";
import { CommonError } from "@app/core/error-handler/common-error";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { of, throwError, Subject } from "rxjs";
import { VerifyFormComponent } from "./verify-form.component";
import { TranslatePipeMock } from "@app/testing/mock.pipe";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("VerifyFormComponent", () => {
  let component: VerifyFormComponent;
  let fixture: ComponentFixture<VerifyFormComponent>;
  let securityServiceSpy: jasmine.SpyObj<SecurityService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let paramMapSubject: Subject<any>;

  beforeEach(async () => {
    securityServiceSpy = jasmine.createSpyObj("SecurityService", ["verify"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    toastrSpy = jasmine.createSpyObj("ToastrService", ["success", "error"]);
    translateSpy = jasmine.createSpyObj("TranslateService", ["instant"]);
    translateSpy.instant.and.callFake((key: string) => key);
    paramMapSubject = new Subject();

    const activatedRouteStub = {
      paramMap: paramMapSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      declarations: [VerifyFormComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: SecurityService, useValue: securityServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("form initialization", () => {
    it("should have email and token controls", () => {
      expect(component.formGroup.get("email")).toBeTruthy();
      expect(component.formGroup.get("token")).toBeTruthy();
    });

    it("should be invalid when empty", () => {
      expect(component.formGroup.valid).toBeFalse();
    });
  });

  describe("route params", () => {
    it("should populate email from route params", fakeAsync(() => {
      paramMapSubject.next({
        get: (key: string) => (key === "email" ? "test@example.com" : null),
      });
      tick();

      expect(component.formGroup.get("email")?.value).toBe("test@example.com");
    }));

    it("should navigate to login if no email in route", fakeAsync(() => {
      paramMapSubject.next({ get: () => null });
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
    }));
  });

  describe("token validation", () => {
    it("should be required", () => {
      const token = component.formGroup.get("token");
      token?.setValue("");
      expect(token?.errors?.["required"]).toBeTruthy();
    });
  });

  describe("onSubmit", () => {
    beforeEach(() => {
      paramMapSubject.next({
        get: (key: string) => (key === "email" ? "test@example.com" : null),
      });
      fixture.detectChanges();
    });

    it("should navigate to reset page on successful verification", fakeAsync(() => {
      securityServiceSpy.verify.and.returnValue(
        of({ token: "reset-hash-token" }),
      );

      component.formGroup.get("token")?.setValue("123456");
      component.onSubmit();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith([
        "/reset/reset-hash-token/test%40example.com",
      ]);
    }));

    it("should show success toast on successful verification", fakeAsync(() => {
      securityServiceSpy.verify.and.returnValue(
        of({ token: "reset-hash-token" }),
      );

      component.formGroup.get("token")?.setValue("123456");
      component.onSubmit();
      tick();

      expect(toastrSpy.success).toHaveBeenCalledWith("SIGN.VERIFY.SUCCESS");
    }));

    it("should display error message on failed verification", fakeAsync(() => {
      const err: CommonError = {
        statusText: "Error",
        messages: ["Invalid token"],
        friendlyMessage: "Error",
        error: { message: "Invalid token" },
      };
      securityServiceSpy.verify.and.returnValue(throwError(err));

      component.formGroup.get("token")?.setValue("wrong");
      component.onSubmit();
      tick();

      expect(component.errorMessage).toBe("Invalid token");
      expect(toastrSpy.error).toHaveBeenCalledWith("Invalid token");
    }));

    it("should not submit if form is invalid", () => {
      component.formGroup.get("token")?.setValue("");
      component.onSubmit();

      expect(securityServiceSpy.verify).not.toHaveBeenCalled();
    });
  });

  describe("form reset", () => {
    it("should reset form and clear state", () => {
      component.formGroup.get("token")?.setValue("123456");
      component.errorMessage = "Error";
      component.submitted = true;

      component.onReset();

      expect(component.formGroup.get("token")?.value).toBeFalsy();
      expect(component.errorMessage).toBeNull();
      expect(component.submitted).toBeFalse();
    });
  });
});
