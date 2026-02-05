import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonError } from '@app/core/error-handler/common-error';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  allBlogs(params={}): Observable<any[] | CommonError> {
    const url = `blogs`;
    return this.httpClient
      .get<any[]>(url,{params:params})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getBlog(id:any): Observable<any[] | CommonError> {
    const url = `blogs/get/${id}`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addBlog(data:any): Observable<any[] | CommonError> {
    const url = `blogs/create`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateBlog(id:any,data:any): Observable<any[] | CommonError> {
    const url = `blogs/update/${id}`;
    return this.httpClient
      .put<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteBlog(id:any): Observable<any[] | CommonError> {
    const url = `blogs/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  commentBlog(id:any,data:any): Observable<any[] | CommonError> {
    const url = `blogs/comments/${id}`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  reactionBlog(id:any,data:any): Observable<any[] | CommonError> {
    const url = `blogs/reactions/${id}`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }


}
