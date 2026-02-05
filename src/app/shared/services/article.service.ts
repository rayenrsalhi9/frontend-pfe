import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../enums/category';
import { CommonError } from '../enums/common-error';

@Injectable({ providedIn: 'root' })
export class ArticleService {
 

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  

  allArticles(params={}): Observable<any[] | CommonError> {
    const url = `articles`;
    return this.httpClient
      .get<any[]>(url,{params:params})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
  

  getArticle(id:any): Observable<any[] | CommonError> {
    const url = `articles/get/${id}`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addArticle(data:any): Observable<any[] | CommonError> {
    const url = `articles/create`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateArticle(id:any,data:any): Observable<any[] | CommonError> {
    const url = `articles/update/${id}`;
    return this.httpClient
      .put<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteArticle(id:any): Observable<any[] | CommonError> {
    const url = `articles/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }


}
