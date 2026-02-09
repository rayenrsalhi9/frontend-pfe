import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '@app/shared/enums/common-error';
import { ResponseAuditTrail } from '@app/shared/enums/response-audit-trail';
import { ResponseAuditResource } from '@app/shared/enums/response-audit-resource';

@Injectable({
  providedIn: 'root',
})
export class ResponseAuditTrailService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  getResponseAuditTrails(resource: ResponseAuditResource): Observable<HttpResponse<ResponseAuditTrail[]> | CommonError> {
    const url = `response-audit`;
    const customParams = new HttpParams()
      .set('fields', resource.fields)
      .set('orderBy', resource.orderBy)
      .set('pageSize', resource.pageSize.toString())
      .set('skip', resource.skip.toString())
      .set('searchQuery', resource.searchQuery)
      .set('forumId', resource.forumId || '')
      .set('userId', resource.userId || '')
      .set('operation', resource.operation || '')
      .set('responseType', resource.responseType || 'all')
      .set('dateFrom', resource.dateFrom || '')
      .set('dateTo', resource.dateTo || '');

    return this.httpClient
      .get<ResponseAuditTrail[]>(url, {
        params: customParams,
        observe: 'response',
      })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}