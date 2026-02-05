import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { DocumentResource } from '../enums/document-resource';
import { UserNotification } from '../enums/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private observeChange = new BehaviorSubject<any>(null);
  emitter$ = this.observeChange.asObservable();

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  refrshNotifications(isRefreshing:any) {
    this.observeChange.next(isRefreshing)
  }


  getNotification(): Observable<UserNotification[] | CommonError> {
    const url = `userNotification/notification`;
    return this.httpClient.get<UserNotification[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getNotifications(resource: DocumentResource): Observable<HttpResponse<UserNotification[]> | CommonError> {
    const url = `userNotification/notifications`;
    const customParams = new HttpParams()
      .set('fields', resource.fields)
      .set('orderBy', resource.orderBy)
      .set('pageSize', resource.pageSize.toString())
      .set('skip', resource.skip.toString())
      .set('searchQuery', resource.searchQuery)
      .set('categoryId', resource.categoryId)
      .set('name', resource.name)
      .set('id', resource.id.toString())
      .set('createdBy', resource.createdBy.toString())

    return this.httpClient.get<UserNotification[]>(url, {
      params: customParams,
      observe: 'response'
    }).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  markAsRead(id: string) {
    const url = `userNotification/MarkAsRead`;
    return this.httpClient.post<void>(url, { id })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  markAllAsRead() {
    const url = `UserNotification/MarkAllAsRead`;
    return this.httpClient.post<void>(url, null)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
