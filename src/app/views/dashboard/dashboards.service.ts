import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonError } from "@app/core/error-handler/common-error";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { CalenderReminderDto } from "@app/shared/enums/calender-reminder";

@Injectable({ providedIn: "root" })
export class DashboardsService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  getDailyReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/daily-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getWeeklyReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/weekly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getMonthlyReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/monthly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getQuarterlyReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/quarterly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getHalfYearlyReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/half-yearly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getYearlyReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/yearly-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getOneTimeReminders(
    month: number,
    year: number,
  ): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/one-time-reminder/${month}/${year}`;
    return this.httpClient
      .get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
