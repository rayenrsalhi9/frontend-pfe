import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonError } from "../enums/common-error";
import { DocumentInfo } from "../enums/document-info";
import { DocumentResource } from "../enums/document-resource";

@Injectable({
  providedIn: "root",
})
export class DocumentAssignedService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  getDocuments(
    resource: DocumentResource,
  ): Observable<HttpResponse<DocumentInfo[]> | CommonError> {
    const url = `document/assigned-documents`;
    let customParams = new HttpParams()
      .set("fields", resource.fields)
      .set("orderBy", resource.orderBy)
      .set("pageSize", resource.pageSize)
      .set("skip", resource.skip);

    if (resource.createDate) {
      customParams = customParams.set("createDateString", resource.createDate.toString());
    }
    if (resource.searchQuery && resource.searchQuery !== '') {
      customParams = customParams.set("searchQuery", resource.searchQuery);
    }
    if (resource.categoryId && resource.categoryId !== '') {
      customParams = customParams.set("categoryId", resource.categoryId);
    }
    if (resource.name && resource.name !== '') {
      customParams = customParams.set("name", resource.name);
    }
    if (resource.metaTags && resource.metaTags !== '') {
      customParams = customParams.set("metaTags", resource.metaTags);
    }
    if (resource.id !== undefined && resource.id !== null && resource.id !== '') {
      customParams = customParams.set("id", resource.id);
    }

    return this.httpClient
      .get<DocumentInfo[]>(url, {
        params: customParams,
        observe: "response",
      })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getDocumentLibrary(id: string): Observable<DocumentInfo> {
    return this.httpClient.get<DocumentInfo>(`document/${encodeURIComponent(id)}`);
  }

  getDocumentViewLibrary(id: string): Observable<DocumentInfo> {
    return this.httpClient.get<DocumentInfo>(`document/view/${encodeURIComponent(id)}`);
  }
}
