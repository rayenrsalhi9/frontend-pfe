import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { DocumentAuditTrail } from '../enums/document-audit-trail';
import { DocumentResource } from '../enums/document-resource';

@Injectable({
  providedIn: 'root',
})
export class DocumentAuditTrailService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  getDocumentAuditTrials(resource: DocumentResource): Observable<HttpResponse<DocumentAuditTrail[]> | CommonError> {
    const url = `documentAuditTrail`;
    const customParams = new HttpParams()
      .set('fields', resource.fields)
      .set('orderBy', resource.orderBy)
      .set('pageSize', resource.pageSize.toString())
      .set('skip', resource.skip.toString())
      .set('searchQuery', resource.searchQuery)
      .set('categoryId', resource.categoryId)
      .set('name', resource.name)
      .set('id', resource.id.toString())
      .set('createdBy', resource.createdBy.toString());

    return this.httpClient
      .get<DocumentAuditTrail[]>(url, {
        params: customParams,
        observe: 'response',
      })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
