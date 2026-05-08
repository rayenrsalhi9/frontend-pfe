import { ComponentFixture, TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService, ToastrModule } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { SurveyDetailComponent } from "./survey-detail.component";
import { SurveyService } from "../survey.service";
import { ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "utcToLocalTime" })
class MockUtcToLocalTimePipe implements PipeTransform {
  transform(value: any): string {
    return value ? new Date(value).toLocaleString() : "";
  }
}

describe("SurveyDetailComponent", () => {
  let component: SurveyDetailComponent;
  let fixture: ComponentFixture<SurveyDetailComponent>;
  let mockSurveyService: any;
  let mockActivatedRoute: any;

  const mockSurvey = {
    id: "123",
    title: "Test Survey",
    type: "simple",
    privacy: "public",
    answers_count: 5,
    creator: { firstName: "John", lastName: "Doe" },
    createdAt: "2026-05-01T00:00:00.000Z",
  };

  const mockStatistics = [
    { month: 5, type: "simple", answer: 0, count: 2 },
    { month: 5, type: "simple", answer: 1, count: 3 },
  ];

  const mockRatingStatistics = [
    { month: 5, type: "rating", answer: 1, count: 1 },
    { month: 5, type: "rating", answer: 2, count: 2 },
    { month: 5, type: "rating", answer: 3, count: 3 },
    { month: 5, type: "rating", answer: 4, count: 4 },
    { month: 5, type: "rating", answer: 5, count: 5 },
  ];

  const mockSatisfactionStatistics = [
    { month: 5, type: "satisfaction", answer: 0, count: 1 },
    { month: 5, type: "satisfaction", answer: 1, count: 2 },
    { month: 5, type: "satisfaction", answer: 2, count: 3 },
  ];

  beforeEach(async () => {
    mockSurveyService = {
      getSurvey: jasmine.createSpy("getSurvey").and.returnValue(of(mockSurvey)),
      getStatistics: jasmine.createSpy("getStatistics").and.returnValue(of(mockStatistics)),
    };

    mockActivatedRoute = {
      paramMap: of({ get: () => "123" }),
    };

    await TestBed.configureTestingModule({
      declarations: [SurveyDetailComponent, MockUtcToLocalTimePipe],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: SurveyService, useValue: mockSurveyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ToastrService,
        TranslateService,
        ChangeDetectorRef,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyDetailComponent);
    component = fixture.componentInstance;
  });

  /* ===========================================
   * Basic Component Tests
   * =========================================== */

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should load survey details on init", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockSurveyService.getSurvey).toHaveBeenCalledWith("123");
  }));

  it("should set isLoading to false after survey loads", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it("should set answersCount from answers_count", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.survey?.answersCount).toBe(5);
  }));

  it("should load statistics after survey loads", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockSurveyService.getStatistics).toHaveBeenCalledWith("123");
  }));

  it("should show spinner when isLoading is true", () => {
    mockSurveyService.getSurvey.and.returnValue(of(mockSurvey));

    expect(component.isLoading).toBeTrue();
  });

  /* ===========================================
   * Error Handling
   * =========================================== */

  it("should handle survey load error gracefully", fakeAsync(() => {
    mockSurveyService.getSurvey.and.returnValue(
      throwError(() => new Error("Server error")),
    );
    const toastrSpy = spyOn(component["toastr"], "error");

    fixture.detectChanges();
    tick();
    flush();

    expect(toastrSpy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  }));

  it("should handle statistics load error gracefully", fakeAsync(() => {
    mockSurveyService.getStatistics.and.returnValue(
      throwError(() => new Error("Stats error")),
    );
    const toastrSpy = spyOn(component["toastr"], "error");

    fixture.detectChanges();
    tick();
    flush();

    expect(toastrSpy).toHaveBeenCalled();
  }));

  /* ===========================================
   * Chart / Statistics Tests
   * =========================================== */

  it("should generate chart options for simple survey type", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.overviewChartOptions.series).toBeDefined();
    expect(component.overviewChartOptions.series?.length).toBe(2);
  }));

  it("should generate chart options for rating survey type", fakeAsync(() => {
    mockSurveyService.getSurvey.and.returnValue(
      of({ ...mockSurvey, type: "rating" }),
    );
    mockSurveyService.getStatistics.and.returnValue(of(mockRatingStatistics));

    fixture.detectChanges();
    tick();

    expect(component.overviewChartOptions.series).toBeDefined();
    expect(component.overviewChartOptions.series?.length).toBe(5);
  }));

  it("should generate chart options for satisfaction survey type", fakeAsync(() => {
    mockSurveyService.getSurvey.and.returnValue(
      of({ ...mockSurvey, type: "satisfaction" }),
    );
    mockSurveyService.getStatistics.and.returnValue(of(mockSatisfactionStatistics));

    fixture.detectChanges();
    tick();

    expect(component.overviewChartOptions.series).toBeDefined();
    expect(component.overviewChartOptions.series?.length).toBe(3);
  }));

  it("should not call getStatistics if survey has no id", () => {
    const emptySurvey = { ...mockSurvey, id: undefined };
    mockSurveyService.getSurvey.and.returnValue(of(emptySurvey));

    component.getStatistics();

    expect(mockSurveyService.getStatistics).not.toHaveBeenCalled();
  });

  /* ===========================================
   * Lifecycle Tests
   * =========================================== */

  it("should unsubscribe on destroy", () => {
    spyOn(component["destroy$"], "next");
    spyOn(component["destroy$"], "complete");

    component.ngOnDestroy();

    expect(component["destroy$"].next).toHaveBeenCalled();
    expect(component["destroy$"].complete).toHaveBeenCalled();
  });
});
