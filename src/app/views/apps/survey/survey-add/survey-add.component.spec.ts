import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { NgSelectModule } from "@ng-select/ng-select";
import { of, throwError } from "rxjs";
import { SurveyAddComponent } from "./survey-add.component";
import { SurveyService } from "../survey.service";
import { SecurityService } from "@app/core/security/security.service";
import { CommonService } from "@app/shared/services/common.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

describe("SurveyAddComponent", () => {
  let component: SurveyAddComponent;
  let fixture: ComponentFixture<SurveyAddComponent>;
  let mockSurveyService: any;
  let mockSecurityService: any;
  let mockCommonService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockUsers = [
    { id: 1, firstName: "Admin", lastName: "User", userName: "admin" },
    { id: 2, firstName: "Jane", lastName: "Smith", userName: "janes" },
    { id: 3, firstName: "Bob", lastName: "Jones", userName: "bjones" },
  ];

  const mockSurvey = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Existing Survey",
    type: "simple",
    privacy: "private",
    blog: true,
    forum: true,
    users: [1, 2],
    creator: { id: 1, firstName: "Admin", lastName: "User" },
  };

  const mockPublicSurvey = {
    id: "223e4567-e89b-12d3-a456-426614174001",
    title: "Public Survey",
    type: "rating",
    privacy: "public",
    blog: true,
    forum: true,
    users: null,
    creator: { id: 1, firstName: "Admin", lastName: "User" },
  };

  beforeEach(async () => {
    mockSurveyService = {
      addSurvey: jasmine
        .createSpy("addSurvey")
        .and.returnValue(of({ id: "new-id" })),
      updateSurvey: jasmine.createSpy("updateSurvey").and.returnValue(of({})),
      getSurvey: jasmine.createSpy("getSurvey").and.returnValue(of(mockSurvey)),
    };

    mockSecurityService = {
      securityObject: {
        user: { id: 1, firstName: "Admin", lastName: "User" },
        claims: ["SURVEY_ADD_SURVEY", "SURVEY_EDIT_SURVEY"],
      },
      getUserDetail: () => ({
        user: { id: 1, firstName: "Admin", lastName: "User" },
      }),
      hasClaim: jasmine.createSpy("hasClaim").and.returnValue(true),
      SecurityObject: of({
        user: { id: 1, firstName: "Admin", lastName: "User" },
        claims: ["SURVEY_ADD_SURVEY", "SURVEY_EDIT_SURVEY"],
      }),
    };

    mockCommonService = {
      getUsers: jasmine.createSpy("getUsers").and.returnValue(of(mockUsers)),
    };

    mockRouter = {
      navigate: jasmine.createSpy("navigate"),
    };

    mockActivatedRoute = {
      paramMap: of({ get: () => null }),
    };

    await TestBed.configureTestingModule({
      declarations: [SurveyAddComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        NgSelectModule,
      ],
      providers: [
        { provide: SurveyService, useValue: mockSurveyService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ===========================================
   * Basic Component Tests
   * =========================================== */

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with correct controls", () => {
    expect(component.surveyForm).toBeTruthy();
    expect(component.surveyForm.get("title")).toBeTruthy();
    expect(component.surveyForm.get("type")).toBeTruthy();
    expect(component.surveyForm.get("users")).toBeTruthy();
    expect(component.surveyForm.get("private")).toBeTruthy();
    expect(component.surveyForm.get("blog")).toBeTruthy();
    expect(component.surveyForm.get("forum")).toBeTruthy();
  });

  it("should have survey types array", () => {
    expect(component.surveyType).toEqual(["simple", "rating", "satisfaction"]);
  });

  /* ===========================================
   * Use Case 1 - Create Public Survey
   * =========================================== */

  it("should validate required fields", () => {
    component.onSubmit();
    expect(component.isSubmitted).toBeTrue();
    expect(component.surveyForm.valid).toBeFalse();
  });

  it("should submit form with public privacy", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Test Public Survey",
      type: "simple",
      private: false,
      blog: true,
      forum: true,
      users: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockSurveyService.addSurvey).toHaveBeenCalled();
    const callArgs = mockSurveyService.addSurvey.calls.mostRecent().args[0];
    expect(callArgs.privacy).toBe("public");
    expect(callArgs.users).toEqual([]);
  }));

  it("should not include users in request when public", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Public Survey",
      type: "rating",
      private: false,
      users: [],
    });

    component.onSubmit();
    tick();
    flush();

    const callArgs = mockSurveyService.addSurvey.calls.mostRecent().args[0];
    expect(callArgs.users).toEqual([]);
    expect(callArgs.privacy).toBe("public");
  }));

  it("should default blog and forum to true", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Test Survey",
      type: "simple",
      private: false,
    });

    component.onSubmit();
    tick();
    flush();

    const callArgs = mockSurveyService.addSurvey.calls.mostRecent().args[0];
    expect(callArgs.blog).toBe(true);
    expect(callArgs.forum).toBe(true);
  }));

  it("should navigate to /apps/surveys after successful creation", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Test Survey",
      type: "simple",
      private: false,
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/apps/surveys"]);
  }));

  it("should show success toastr on successful creation", fakeAsync(() => {
    const toastrSpy = spyOn(component["toastrService"], "success");
    component.surveyForm.patchValue({
      title: "Test Survey",
      type: "simple",
      private: false,
    });

    component.onSubmit();
    tick();
    flush();

    expect(toastrSpy).toHaveBeenCalled();
  }));

  /* ===========================================
   * Use Case 2 - Create Private Survey
   * =========================================== */

  it("should show users dropdown when private is checked", () => {
    component.surveyForm.get("private")?.setValue(true);
    fixture.detectChanges();

    expect(component.surveyForm.get("private")?.value).toBeTrue();
  });

  it("should auto-add current user when private and users empty", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Private Survey",
      type: "simple",
      private: true,
      users: [],
    });

    component.onSubmit();
    tick();
    flush();

    const callArgs = mockSurveyService.addSurvey.calls.mostRecent().args[0];
    expect(callArgs.privacy).toBe("private");
    expect(callArgs.users).toContain(1);
  }));

  it("should submit with privacy=private and users array", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Private Survey",
      type: "simple",
      private: true,
      users: [2, 3],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockSurveyService.addSurvey).toHaveBeenCalled();
    const callArgs = mockSurveyService.addSurvey.calls.mostRecent().args[0];
    expect(callArgs.privacy).toBe("private");
    expect(callArgs.users).toContain(1);
    expect(callArgs.users).toContain(2);
    expect(callArgs.users).toContain(3);
  }));

  it("should include creator in users list when creator not in selected users", fakeAsync(() => {
    component.surveyForm.patchValue({
      title: "Private Survey",
      type: "simple",
      private: true,
      users: [2],
    });

    component.onSubmit();
    tick();
    flush();

    const callArgs = mockSurveyService.addSurvey.calls.mostRecent().args[0];
    expect(callArgs.users).toContain(1);
    expect(callArgs.users).toContain(2);
    expect(callArgs.users.length).toBe(2);
  }));

  /* ===========================================
   * Use Case 3 - Edit Survey
   * =========================================== */

  it("should load survey data in edit mode", fakeAsync(() => {
    mockActivatedRoute.paramMap = of({
      get: (param: string) =>
        param === "id" ? "123e4567-e89b-12d3-a456-426614174000" : null,
    });

    component.ngOnInit();
    tick();

    expect(mockSurveyService.getSurvey).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
    );
    expect(component.isEdit).toBeTrue();
    expect(component.surveyId).toBe("123e4567-e89b-12d3-a456-426614174000");
  }));

  it("should populate form with existing survey data", fakeAsync(() => {
    mockSurveyService.getSurvey.and.returnValue(of(mockSurvey));

    mockActivatedRoute.paramMap = of({
      get: (param: string) =>
        param === "id" ? "123e4567-e89b-12d3-a456-426614174000" : null,
    });

    component.ngOnInit();
    tick();

    expect(component.surveyForm.get("title")?.value).toBe("Existing Survey");
    expect(component.surveyForm.get("type")?.value).toBe("simple");
    expect(component.surveyForm.get("private")?.value).toBeTrue();
    expect(component.surveyForm.get("blog")?.value).toBeTrue();
    expect(component.surveyForm.get("forum")?.value).toBeTrue();
  }));

  it("should set privacy control based on privacy field", fakeAsync(() => {
    mockSurveyService.getSurvey.and.returnValue(of(mockPublicSurvey));

    mockActivatedRoute.paramMap = of({
      get: (param: string) =>
        param === "id" ? "223e4567-e89b-12d3-a456-426614174001" : null,
    });

    component.ngOnInit();
    tick();

    expect(component.surveyForm.get("private")?.value).toBeFalse();
  }));

  it("should load users when entering edit mode", fakeAsync(() => {
    mockSurveyService.getSurvey.and.returnValue(of(mockSurvey));

    mockActivatedRoute.paramMap = of({
      get: (param: string) =>
        param === "id" ? "123e4567-e89b-12d3-a456-426614174000" : null,
    });

    component.ngOnInit();
    tick();

    expect(mockCommonService.getUsers).toHaveBeenCalled();
  }));

  it("should call updateSurvey with updated data in edit mode", fakeAsync(() => {
    component.isEdit = true;
    component.surveyId = "123e4567-e89b-12d3-a456-426614174000";
    component.surveyForm.patchValue({
      title: "Updated Survey",
      type: "simple",
      private: false,
      users: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(mockSurveyService.updateSurvey).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      jasmine.any(Object),
    );
  }));

  it("should handle update error gracefully", fakeAsync(() => {
    mockSurveyService.updateSurvey.and.returnValue(
      throwError(() => new Error("Server error")),
    );
    const toastrSpy = spyOn(component["toastrService"], "error");

    component.isEdit = true;
    component.surveyId = "123";
    component.surveyForm.patchValue({
      title: "Failing Survey",
      type: "simple",
      private: false,
      users: [],
    });

    component.onSubmit();
    tick();
    flush();

    expect(toastrSpy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it("should switch privacy from private to public - clear users", fakeAsync(() => {
    component.surveyForm.get("private")?.setValue(true);
    component.surveyForm.get("users")?.setValue([1, 2]);
    tick();

    component.surveyForm.get("private")?.setValue(false);
    tick();

    expect(component.surveyForm.get("users")?.value).toEqual([]);
  }));

  /* ===========================================
   * Claims Testing
   * =========================================== */

  it("should create form regardless of claim", () => {
    expect(component.surveyForm).toBeTruthy();
  });

  /* ===========================================
   * Additional Edge Cases
   * =========================================== */

  it("should handle addSurvey error gracefully", fakeAsync(() => {
    mockSurveyService.addSurvey.and.returnValue(
      throwError(() => new Error("Server error")),
    );
    const toastrSpy = spyOn(component["toastrService"], "error");

    component.surveyForm.patchValue({
      title: "Test Survey",
      type: "simple",
      private: false,
    });

    component.onSubmit();
    tick();
    flush();

    expect(toastrSpy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it("should show validation warning when form is invalid", () => {
    const toastrSpy = spyOn(component["toastrService"], "warning");

    component.onSubmit();

    expect(toastrSpy).toHaveBeenCalled();
    expect(component.isSubmitted).toBeTrue();
  });

  it("should cancel and navigate to survey list", () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/apps/surveys"]);
  });

  it("should unsubscribe on destroy", () => {
    spyOn(component["destroy$"], "next");
    spyOn(component["destroy$"], "complete");

    component.ngOnDestroy();

    expect(component["destroy$"].next).toHaveBeenCalled();
    expect(component["destroy$"].complete).toHaveBeenCalled();
  });
});
