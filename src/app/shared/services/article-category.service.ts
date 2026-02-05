import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';

@Injectable({ providedIn: 'root' })
export class ArticleCategoryService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  allCategories(): Observable<any[] | CommonError> {
    const url = `articles/categories`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addCategory(data:any): Observable<any[] | CommonError> {
    const url = `articles/categories/create`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateCategpry(id:any, data:any): Observable<any[] | CommonError> {
    const url = `articles/categories/update/${id}`;
    return this.httpClient
      .put<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteCategory(id:any): Observable<any[] | CommonError> {
    const url = `articles/categories/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

}
