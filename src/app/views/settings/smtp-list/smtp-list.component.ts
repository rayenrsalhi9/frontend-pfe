import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EmailSMTPSetting } from '@app/shared/enums/email-smtp-setting';
import { EmailSmtpSettingService } from '@app/shared/services/email-smtp-setting.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-smtp-list',
  templateUrl: './smtp-list.component.html',
  styleUrls: ['./smtp-list.component.css']
})
export class SmtpListComponent implements OnInit {


  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  emailSMTPSettings: EmailSMTPSetting[] = [];

  constructor(
    private emailSmtpSettingService: EmailSmtpSettingService,
    private toastrService: ToastrService,
    private cdr:ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getEmailSMTPSettings()
  }

  getEmailSMTPSettings() {
    this.emailSmtpSettingService
      .getEmailSMTPSettings()
      .subscribe((settings: EmailSMTPSetting[]) => {
        this.emailSMTPSettings = settings;
        this.cdr.markForCheck()
      });
    this.cdr.detectChanges()
  }

  deleteEmailSMTPSetting(setting: EmailSMTPSetting) {
    this.emailSmtpSettingService
      .deleteEmailSMTPSetting(setting.id)
      .subscribe(() => {
        this.translate.get('SMTPS.LIST.TOAST.EMAIL_SMTP_SETUP_DELETED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage); 
        }); 
        this.getEmailSMTPSettings();
      });
  }

}
