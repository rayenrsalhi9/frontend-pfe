import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DocumentComment } from "../enums/document-comment";

@Injectable({ providedIn: "root" })
export class DocumentCommentService {
  constructor(private httpClient: HttpClient) {}

  getDocumentComment(documentId: string): Observable<DocumentComment[]> {
    const url = `document-comment/${documentId}`;
    return this.httpClient.get<DocumentComment[]>(url);
  }
  deleteDocumentComment(id: string): Observable<void> {
    const url = `document-comment/${id}`;
    return this.httpClient.delete<void>(url);
  }
  saveDocumentComment(
    documentComment: DocumentComment,
  ): Observable<DocumentComment> {
    const url = "document-comment";
    return this.httpClient.post<DocumentComment>(url, documentComment);
  }
}
