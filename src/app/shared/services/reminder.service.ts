import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { Reminder } from '../enums/reminder';
import { ReminderResourceParameter } from '../enums/reminder-resource-parameter';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }


  getReminders(
    resourceParams: ReminderResourceParameter
  ): Observable<HttpResponse<Reminder[]>> {
    const url = 'reminder/all';
    const customParams = new HttpParams()
      .set('fields', resourceParams.fields ? resourceParams.fields : '')
      .set('orderBy', resourceParams.orderBy ? resourceParams.orderBy : '')
      .set('pageSize', resourceParams.pageSize.toString())
      .set('skip', resourceParams.skip.toString())
      .set('searchQuery', resourceParams.searchQuery ? resourceParams.searchQuery : '')
      .set('subject', resourceParams.subject ? resourceParams.subject : '')
      .set('message', resourceParams.message ? resourceParams.message : '')
      .set('frequency', resourceParams.frequency ? resourceParams.frequency : '');

    return this.httpClient.get<Reminder[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  addReminder(reminder: Reminder): Observable<Reminder | CommonError> {
    const url = `reminder`;
    return this.httpClient.post<Reminder>(url, reminder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addDocumentReminder(reminder: Reminder): Observable<Reminder | CommonError> {
    const url = `reminder/document`;
    return this.httpClient.post<Reminder>(url, reminder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateReminder(reminder: Reminder): Observable<Reminder | CommonError> {
    const url = `reminder/${reminder.id}`;
    return this.httpClient.put<Reminder>(url, reminder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteReminder(id: string): Observable<Reminder | CommonError> {
    const url = `reminder/${id}`;
    return this.httpClient.delete<Reminder>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
