import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonError } from '@app/core/error-handler/common-error';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BlogCategoryService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  allCategories(params={}): Observable<any[] | CommonError> {
    const url = `blogs/categories`;
    return this.httpClient
      .get<any[]>(url,{params:params})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getCategory(id:any): Observable<any[] | CommonError> {
    const url = `blogs/categories/get/${id}`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addCategory(data:any): Observable<any[] | CommonError> {
    const url = `blogs/categories/create`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateCategory(id:any,data:any): Observable<any[] | CommonError> {
    const url = `blogs/categories/update/${id}`;
    return this.httpClient
      .put<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteCategory(id:any): Observable<any[] | CommonError> {
    const url = `blogs/categories/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }




}
