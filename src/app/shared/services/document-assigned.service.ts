import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { DocumentInfo } from '../enums/document-info';
import { DocumentResource } from '../enums/document-resource';

@Injectable({
  providedIn: 'root',
})
export class DocumentAssignedService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  getDocuments(resource: DocumentResource): Observable<HttpResponse<DocumentInfo[]> | CommonError> {
    const url = `document/assignedDocuments`;
    const customParams = new HttpParams()
      .set('fields', resource.fields)
      .set('orderBy', resource.orderBy)
      .set('pageSize', resource.pageSize.toString())
      .set( 'createDateString', resource.createDate ? resource.createDate.toString() : '' )
      .set('skip', resource.skip.toString())
      .set('searchQuery', resource.searchQuery)
      .set('categoryId', resource.categoryId)
      .set('name', resource.name)
      .set('metaTags', resource.metaTags)
      .set('id', resource.id.toString());

    return this.httpClient
      .get<DocumentInfo[]>(url, {
        params: customParams,
        observe: 'response',
      })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getDocumentLibrary(id: string): Observable<DocumentInfo> {
    return this.httpClient.get<DocumentInfo>('document/' + id);
  }

  getDocumentViewLibrary(id: string): Observable<DocumentInfo> {
    return this.httpClient.get<DocumentInfo>('document/view/' + id);
  }
}
