import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { SendEmail } from '../enums/send-email';

@Injectable({
  providedIn: 'root'
})
export class EmailSendService {

  constructor(private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  sendEmail(sendEmail: SendEmail): Observable<void | CommonError> {
    const url = 'email';
    console.log(sendEmail);
    
    return this.httpClient.post<void>(url, sendEmail)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
