import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonError } from "../enums/common-error";
import { CompanyProfile } from "../enums/company-profile";


@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {

  private dataSubject = new BehaviorSubject<CompanyProfile>(null);
  data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  refreshCompanyProfile(data: any) {
    this.dataSubject.next(data);
  }

  getCompanyProfile(): Observable<CompanyProfile | CommonError> {
    const url = `companyProfile`;
    return this.http.get<CompanyProfile>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateCompanyProfile(companyProfile): Observable<CompanyProfile | CommonError> {
    const url = `companyProfile`;
    return this.http.post<CompanyProfile>(url, companyProfile)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
