import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { DocumentInfo } from '../enums/document-info';
import { DocumentResource } from '../enums/document-resource';
import { DocumentVersion } from '../enums/documentVersion';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  updateDocument(
    document: DocumentInfo
  ): Observable<DocumentInfo | CommonError> {
    document.documentMetaDatas = document.documentMetaDatas?.filter(
      (c) => c.metatag
    );

    const url = `document/${document.id}`;
    return this.httpClient
      .put<DocumentInfo>(url, document)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addDocument(document: DocumentInfo): Observable<DocumentInfo | CommonError> {
    document.documentMetaDatas = document.documentMetaDatas?.filter(
      (c) => c.metatag
    );
    const url = `document`;
    const formData = new FormData();
    formData.append('uploadFile', document.fileData);
    formData.append('name', document.name);
    formData.append('categoryId', document.categoryId);
    formData.append('categoryName', document.categoryName);
    formData.append('description', document.description);
    formData.append('extension', document.fileData.type);
    // formData.append('isAllowDownload', document.isAllowDownload.toString());
    formData.append(
      'documentMetaDatas',
      JSON.stringify(document.documentMetaDatas)
    );
    formData.append(
      'documentRolePermissions',
      JSON.stringify(document.documentRolePermissions ?? [])
    );

    formData.append(
      'documentUserPermissions',
      JSON.stringify(document.documentUserPermissions ?? [])
    );

    return this.httpClient
      .post<DocumentInfo>(url, formData)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteDocument(id: string): Observable<void | CommonError> {
    const url = `document/${id}`;
    return this.httpClient
      .delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getDocument(id: string): Observable<DocumentInfo | CommonError> {
    const url = `document/${id}`;
    return this.httpClient
      .get<DocumentInfo>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getDocuments( resource: DocumentResource ): Observable<HttpResponse<DocumentInfo[]> | CommonError> {
    const url = `documents`;
    const customParams = new HttpParams()
      .set('fields', resource.fields)
      .set('orderBy', resource.orderBy)
      .set( 'createDateString', resource.createDate ? resource.createDate.toString() : '' )
      .set('pageSize', resource.pageSize.toString())
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

  getDocumentByExtension(){
    const url = `documents/extension`;
    return this.httpClient
    .get<DocumentInfo[]>(url)
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  documentTransaction() {
    const url = 'documents/transactions'
    return this.httpClient
    .get<DocumentInfo[]>(url)
    .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  saveNewVersionDocument(document): Observable<DocumentInfo | CommonError> {
    const url = `documentversion`;
    const formData = new FormData();
    formData.append('uploadFile', document.fileData);
    formData.append('documentId', document.documentId);
    return this.httpClient
      .post<DocumentInfo>(url, formData)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getDocumentVersion(id: string) {
    const url = `documentversion/${id}`;
    return this.httpClient
      .get<DocumentVersion[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  restoreDocumentVersion(id: string, versionId: string) {
    const url = `documentversion/${id}/restore/${versionId}`;
    return this.httpClient
      .post<boolean>(url, {})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getdocumentMetadataById(id: string) {
    const url = `document/${id}/getMetatag`;
    return this.httpClient
      .get(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
