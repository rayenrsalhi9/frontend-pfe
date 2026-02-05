import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpErrorService } from '@app/core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../enums/common-error';
import { EmailSMTPSetting } from '../enums/email-smtp-setting';

@Injectable({
  providedIn: 'root'
})
export class EmailSmtpSettingService {

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getEmailSMTPSettings(): Observable<EmailSMTPSetting[] | CommonError> {
    const url = 'emailSMTPSetting';
    return this.httpClient.get<EmailSMTPSetting[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getEmailSMTPSetting(id: string): Observable<EmailSMTPSetting | CommonError> {
    const url = ` /${id}`;
    return this.httpClient.get<EmailSMTPSetting>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addEmailSMTPSetting(setting: EmailSMTPSetting): Observable<EmailSMTPSetting | CommonError> {
    const url = `emailSMTPSetting`;
    return this.httpClient.post<EmailSMTPSetting>(url, setting)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateEmailSMTPSetting(setting: EmailSMTPSetting): Observable<EmailSMTPSetting | CommonError> {
    const url = `emailSMTPSetting/${setting.id}`;
    return this.httpClient.put<EmailSMTPSetting>(url, setting)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteEmailSMTPSetting(id: string): Observable<EmailSMTPSetting | CommonError> {
    const url = `emailSMTPSetting/${id}`;
    return this.httpClient.delete<EmailSMTPSetting>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
