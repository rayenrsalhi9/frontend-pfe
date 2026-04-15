import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonError } from "../enums/common-error";
import { DocumentPermission } from "../enums/document-permission";
import { DocumentRolePermission } from "../enums/document-role-permission";
import { DocumentUserPermission } from "../enums/document-user-permission";
import { PermissionUserRole } from "../enums/permission-user-role";

@Injectable({
  providedIn: "root",
})
export class DocumentPermissionService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  getDoucmentPermission(
    id: string,
  ): Observable<DocumentPermission[] | CommonError> {
    const url = `document-role-permission/${id}`;
    return this.httpClient
      .get<DocumentPermission[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteDocumentUserPermission(id: string): Observable<void | CommonError> {
    const url = `document-user-permission/${id}`;
    return this.httpClient
      .delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteDocumentRolePermission(id: string): Observable<void | CommonError> {
    const url = `document-role-permission/${id}`;
    return this.httpClient
      .delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addDocumentUserPermission(
    documentUserPermissions: DocumentUserPermission[],
  ): Observable<void | CommonError> {
    const url = "document-user-permission";
    return this.httpClient
      .post<void>(url, { documentUserPermissions })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addDocumentRolePermission(
    documentRolePermissions: DocumentRolePermission[],
  ): Observable<void | CommonError> {
    const url = "document-role-permission";
    return this.httpClient
      .post<void>(url, { documentRolePermissions })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  multipleDocumentsToUsersAndRoles(
    permissionUserRole: PermissionUserRole,
  ): Observable<boolean | CommonError> {
    const url = "document-role-permission/multiple";
    return this.httpClient
      .post<boolean>(url, permissionUserRole)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
