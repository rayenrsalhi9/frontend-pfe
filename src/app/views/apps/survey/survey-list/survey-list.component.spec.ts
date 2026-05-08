import { ComponentFixture, TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { of, Subject } from "rxjs";
import { SurveyListComponent } from "./survey-list.component";
import { SurveyService } from "../survey.service";
import { SecurityService } from "@app/core/security/security.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from "@angular/core";

describe("SurveyListComponent", () => {
  let component: SurveyListComponent;
  let fixture: ComponentFixture<SurveyListComponent>;
  let mockSurveyService: any;
  let mockSecurityService: any;
  let mockModalService: any;

  const mockSurveys = [
    {
      id: "1",
      title: "Survey 1",
      type: "simple",
      privacy: "public",
      createdAt: "2026-05-01T00:00:00.000Z",
      creator: { firstName: "John", lastName: "Doe" },
    },
    {
      id: "2",
      title: "Survey 2",
      type: "rating",
      privacy: "private",
      createdAt: "2026-05-02T00:00:00.000Z",
      creator: { firstName: "Jane", lastName: "Smith" },
    },
    {
      id: "3",
      title: "Survey 3",
      type: "satisfaction",
      privacy: "public",
      createdAt: "2026-05-03T00:00:00.000Z",
      creator: { firstName: "Bob", lastName: "Jones" },
    },
  ];

  beforeEach(async () => {
    mockSurveyService = {
      allSurveys: jasmine.createSpy("allSurveys").and.returnValue(of(mockSurveys)),
      deleteSurvey: jasmine.createSpy("deleteSurvey").and.returnValue(of({})),
    };

    mockSecurityService = {
      hasClaim: jasmine.createSpy("hasClaim").and.callFake((claim: string) => {
        if (claim === "SURVEY_VIEW_STATISTICS") return true;
        if (claim === "SURVEY_EDIT_SURVEY") return true;
        if (claim === "SURVEY_DELETE_SURVEY") return true;
        return false;
      }),
      SecurityObject: of({
        user: { id: 1, firstName: "Admin", lastName: "User" },
        claims: ["SURVEY_VIEW_STATISTICS", "SURVEY_EDIT_SURVEY", "SURVEY_DELETE_SURVEY"],
      }),
    };

    mockModalService = {
      show: jasmine.createSpy("show").and.returnValue({
        content: {
          onClose: of(true),
        },
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [SurveyListComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: SurveyService, useValue: mockSurveyService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: BsModalService, useValue: mockModalService },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyListComponent);
    component = fixture.componentInstance;
  });

  /* ===========================================
   * Basic Component Tests
   * =========================================== */

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should load surveys on init", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);

    expect(mockSurveyService.allSurveys).toHaveBeenCalled();
    expect(component.rows.length).toBe(3);
  }));

  it("should check hasClaim for actions", () => {
    fixture.detectChanges();

    expect(mockSecurityService.hasClaim).toHaveBeenCalledWith("SURVEY_VIEW_STATISTICS");
    expect(mockSecurityService.hasClaim).toHaveBeenCalledWith("SURVEY_EDIT_SURVEY");
    expect(mockSecurityService.hasClaim).toHaveBeenCalledWith("SURVEY_DELETE_SURVEY");
  });

  it("should set canViewStats when user has SURVEY_VIEW_STATISTICS claim", () => {
    mockSecurityService.hasClaim.and.callFake((claim: string) => {
      if (claim === "SURVEY_VIEW_STATISTICS") return true;
      return false;
    });

    fixture.detectChanges();

    expect(component.canViewStats).toBeTrue();
  });

  it("should set canEdit and canDelete based on claims", () => {
    mockSecurityService.hasClaim.and.callFake((claim: string) => {
      if (claim === "SURVEY_EDIT_SURVEY") return true;
      if (claim === "SURVEY_DELETE_SURVEY") return false;
      return false;
    });

    fixture.detectChanges();

    expect(component.canEdit).toBeTrue();
    expect(component.canDelete).toBeFalse();
    expect(component.canPerformAnyAction).toBeTrue();
  });

  /* ===========================================
   * Search / Filter Tests
   * =========================================== */

  it("should search by title on onNameChange", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockSurveyService.allSurveys.calls.reset();

    const event = { target: { value: "test" } };
    component.onNameChange(event);
    tick(350);

    expect(mockSurveyService.allSurveys).toHaveBeenCalled();
    expect(component.surveyResource.title).toBe("test");
  }));

  it("should filter by type on onCategoryChange", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockSurveyService.allSurveys.calls.reset();

    component.onCategoryChange("simple");
    tick(350);

    expect(mockSurveyService.allSurveys).toHaveBeenCalled();
    expect(component.surveyResource.type).toBe("simple");
  }));

  it("should filter by date on onDateChange", fakeAsync(() => {
    fixture.detectChanges();
    tick(350);
    mockSurveyService.allSurveys.calls.reset();

    const testDate = new Date("2026-05-15");
    component.onDateChange(testDate);
    tick(350);

    expect(mockSurveyService.allSurveys).toHaveBeenCalled();
  }));

  /* ===========================================
   * Delete Survey Tests
   * =========================================== */

  it("should open confirm modal on deleteSurvey", fakeAsync(() => {
    const translateService = TestBed.inject(TranslateService);
    spyOn(translateService, "get").and.returnValue(
      of({
        TITLE: "Delete",
        MESSAGE: "Are you sure?",
        BUTTON: { CANCEL: "No", CONFIRM: "Yes" },
      }),
    );

    component.deleteSurvey(mockSurveys[0]);
    tick();
    flush();

    expect(mockModalService.show).toHaveBeenCalled();
  }));

  it("should delete survey after modal confirmation", fakeAsync(() => {
    const translateService = TestBed.inject(TranslateService);
    spyOn(translateService, "get").and.returnValue(
      of({
        TITLE: "Delete",
        MESSAGE: "Are you sure?",
        BUTTON: { CANCEL: "No", CONFIRM: "Yes" },
      }),
    );

    component.deleteSurvey(mockSurveys[0]);
    tick();
    flush();

    expect(mockSurveyService.deleteSurvey).toHaveBeenCalledWith("1");
  }));

  /* ===========================================
   * Helper Method Tests
   * =========================================== */

  it("should formatCreatorName with firstName and lastName", () => {
    const creator = { firstName: "John", lastName: "Doe" };
    expect(component.formatCreatorName(creator)).toBe("John Doe");
  });

  it("should formatCreatorName with fullName fallback", () => {
    const creator = { fullName: "John Doe" };
    expect(component.formatCreatorName(creator)).toBe("John Doe");
  });

  it("should formatCreatorName return dash for null", () => {
    expect(component.formatCreatorName(null)).toBe("-");
  });

  it("should getAnswerCount correctly", () => {
    const results = [
      { answer: 1 },
      { answer: 1 },
      { answer: 2 },
      { answer: 3 },
    ];
    expect(component.getAnswerCount(1, results)).toBe(2);
    expect(component.getAnswerCount(2, results)).toBe(1);
    expect(component.getAnswerCount(5, results)).toBe(0);
  });

  it("should handle onSelect properly", () => {
    const selected = [{ id: 1 }, { id: 2 }];
    component.onSelect({ selected });
    expect(component.selected.length).toBe(2);
  });

  /* ===========================================
   * Lifecycle Tests
   * =========================================== */

  it("should unsubscribe on destroy", () => {
    component.ngOnDestroy();

    expect(component["destroy$"].isStopped).toBeTrue();
  });
});
