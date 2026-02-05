import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonError } from '@app/core/error-handler/common-error';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ForumService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  allForums(params={}): Observable<any[] | CommonError> {
    const url = `forums`;
    return this.httpClient
      .get<any[]>(url,{params:params})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getForum(id:any): Observable<any[] | CommonError> {
    const url = `forums/get/${id}`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addForum(data:any): Observable<any[] | CommonError> {
    const url = `forums/create`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateForum(id:any,data:any): Observable<any[] | CommonError> {
    const url = `forums/update/${id}`;
    return this.httpClient
      .put<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteForum(id:any): Observable<any[] | CommonError> {
    const url = `forums/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  commentForum(id:any,data:any): Observable<any[] | CommonError> {
    const url = `forums/comments/${id}`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  reactionForum(id:any,data:any): Observable<any[] | CommonError> {
    const url = `forums/reactions/${id}`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteComment(id:any) {
    const url = `forums/comments/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }


}
