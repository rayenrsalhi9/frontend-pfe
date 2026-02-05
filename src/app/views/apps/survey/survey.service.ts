import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonError } from '@app/core/error-handler/common-error';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  allSurveys(params={}): Observable<any[] | CommonError> {
    const url = `surveys`;
    return this.httpClient
      .get<any[]>(url,{params:params})
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getSurvey(id:any): Observable<any[] | CommonError> {
    const url = `surveys/get/${id}`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getStatistics(id:any): Observable<any[] | CommonError> {
    const url = `surveys/statistics/${id}`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getLatestSurvey(): Observable<any[] | CommonError> {
    const url = `surveys/latest`;
    return this.httpClient
      .get<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  responseSurvey(id:any, data:any): Observable<any[] | CommonError> {
    const url = `surveys/answer/${id}`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addSurvey(data:any): Observable<any[] | CommonError> {
    const url = `surveys/create`;
    return this.httpClient
      .post<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateSurvey(id:any,data:any): Observable<any[] | CommonError> {
    const url = `surveys/update/${id}`;
    return this.httpClient
      .put<any[]>(url,data)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteSurvey(id:any): Observable<any[] | CommonError> {
    const url = `surveys/delete/${id}`;
    return this.httpClient
      .delete<any[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }


}
