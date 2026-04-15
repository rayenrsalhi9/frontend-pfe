import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";

import { DocumentAuditTrail } from "../enums/document-audit-trail";
import { Reminder } from "../enums/reminder";
import {
  ReminderFrequency,
  reminderFrequencies,
} from "../enums/reminder-frequency";
import { ReminderResourceParameter } from "../enums/reminder-resource-parameter";
import { Role } from "../enums/role";
import { User } from "../enums/user-auth";
import { CommonError } from "../enums/common-error";

@Injectable({ providedIn: "root" })
export class CommonService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
  ) {}

  getUsers(): Observable<User[] | CommonError> {
    const url = `user`;
    return this.httpClient
      .get<User[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUsersForDropdown(): Observable<User[] | CommonError> {
    const url = `user-dropdown`;
    return this.httpClient
      .get<User[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUsersWithClaim(
    claimType: string = "CHAT_VIEW_CHATS",
  ): Observable<User[] | CommonError> {
    const url = `user-with-claim`;
    const params = new HttpParams().set("claim", claimType);
    return this.httpClient
      .get<User[]>(url, { params })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRoles(): Observable<Role[] | CommonError> {
    const url = `role`;
    return this.httpClient
      .get<Role[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRolesForDropdown(): Observable<Role[] | CommonError> {
    const url = "role-dropdown";
    return this.httpClient
      .get<Role[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getMyReminder(id: string): Observable<Reminder | CommonError> {
    const url = `reminder/${id}/my-reminder`;
    return this.httpClient
      .get<Reminder>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getReminder(id: string): Observable<Reminder | CommonError> {
    const url = `reminder/${id}`;
    return this.httpClient
      .get<Reminder>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addDocumentAuditTrail(
    documentAuditTrail: DocumentAuditTrail,
  ): Observable<DocumentAuditTrail | CommonError> {
    const url = `document-audit-trail`;
    return this.httpClient
      .post<DocumentAuditTrail>(url, documentAuditTrail)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  downloadDocument(
    documentId: string,
    isVersion: boolean,
  ): Observable<HttpEvent<Blob>> {
    const url = `document/${documentId}/download/${isVersion} `;
    return this.httpClient.get(url, {
      reportProgress: true,
      observe: "events",
      responseType: "blob",
    });
  }

  isDownloadFlag(
    documentId: string,
    isPermission: boolean,
  ): Observable<boolean> {
    const url = `document/${documentId}/is-download-flag/is-permission/${isPermission}`;
    return this.httpClient.get<boolean>(url);
  }

  getDocumentToken(documentId: string): Observable<{ [key: string]: string }> {
    const url = `document-token/${documentId}/token`;
    return this.httpClient.get<{ [key: string]: string }>(url);
  }

  deleteDocumentToken(token: string): Observable<boolean> {
    const url = `document-token/${token}`;
    return this.httpClient.delete<boolean>(url);
  }

  readDocument(
    documentId: string,
    isVersion: boolean,
  ): Observable<{ [key: string]: string[] }> {
    const url = `document/${documentId}/read-text/${isVersion}`;
    return this.httpClient.get<{ [key: string]: string[] }>(url);
  }

  getReminderFrequency(): Observable<ReminderFrequency[]> {
    return of(reminderFrequencies);
  }

  getAllRemindersForCurrentUser(
    resourceParams: ReminderResourceParameter,
  ): Observable<HttpResponse<Reminder[]>> {
    const url = "reminder/all/currentuser";
    const customParams = new HttpParams()
      .set("fields", resourceParams.fields ? resourceParams.fields : "")
      .set("orderBy", resourceParams.orderBy ? resourceParams.orderBy : "")
      .set("pageSize", resourceParams.pageSize.toString())
      .set("skip", resourceParams.skip.toString())
      .set(
        "searchQuery",
        resourceParams.searchQuery ? resourceParams.searchQuery : "",
      )
      .set("subject", resourceParams.subject ? resourceParams.subject : "")
      .set("message", resourceParams.message ? resourceParams.message : "")
      .set(
        "frequency",
        resourceParams.frequency ? resourceParams.frequency : "",
      );

    return this.httpClient.get<Reminder[]>(url, {
      params: customParams,
      observe: "response",
    });
  }

  deleteReminderCurrentUser(reminderId: string): Observable<boolean> {
    const url = `reminder/currentuser/${reminderId}`;
    return this.httpClient.delete<boolean>(url);
  }
}
