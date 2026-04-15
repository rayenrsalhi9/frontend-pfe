import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { CalenderReminderDto } from "../enums/calender-reminder";
import { CommonError } from "../enums/common-error";
import { DocumentByCategory } from "../enums/document-by-category";

@Injectable({ providedIn: "root" })
export class DashboradService {
  private observeChange = new BehaviorSubject<any>(null);
  emitter$ = this.observeChange.asObservable();

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  refreshDash(isRefreshing: any) {
    this.observeChange.next(isRefreshing);
  }

  getDocumentByCategory(): Observable<DocumentByCategory[]> {
    const url = `dashboard/get-document-by-category`;
    return this.httpClient.get<DocumentByCategory[]>(url);
  }

  getDailyReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/daily-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getWeeklyReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/weekly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getMonthlyReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/monthly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getQuarterlyReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/quarterly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getHalfYearlyReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/half-yearly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getYearlyReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/yearly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getOneTimeReminders(
    month,
    year,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/one-time-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
