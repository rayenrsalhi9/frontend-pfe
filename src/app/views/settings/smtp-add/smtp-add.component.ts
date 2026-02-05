import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailSMTPSetting } from '@app/shared/enums/email-smtp-setting';
import { EmailSmtpSettingService } from '@app/shared/services/email-smtp-setting.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; 


@Component({
  selector: 'app-smtp-add',
  templateUrl: './smtp-add.component.html',
  styleUrls: ['./smtp-add.component.css']
})
export class SmtpAddComponent implements OnInit {

  isEditMode = false;
  smtpSettingForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private emailSmtpSettingService: EmailSmtpSettingService,
    private toastrService: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createEmailSMTPForm();

    this.activeRoute.paramMap.subscribe(params => {
      let id = params.get('id')
      if(id) {
        this.emailSmtpSettingService.getEmailSMTPSetting(id).subscribe(
          (data:any)=>{
            this.isEditMode = true
            this.smtpSettingForm.patchValue(data);
          }
        )
      }

    })
    /* this.activeRoute.data.subscribe(
      (data: { smtpSetting: EmailSMTPSetting }) => {
        if (data.smtpSetting) {
          this.isEditMode = true;
          this.smtpSettingForm.patchValue(data.smtpSetting);
        }
      }
    ); */
  }

  createEmailSMTPForm() {
    this.smtpSettingForm = this.fb.group({
      id: [''],
      host: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      encryption: ['ssl'],
      fromName: [''],
      port: ['', [Validators.required]],
      isDefault: [false],
    });
  }

  saveEmailSMTPSetting() {
    if (this.smtpSettingForm.valid) {
      const emailSMTPSetting = this.createBuildObject();
      if (this.isEditMode) {
        this.emailSmtpSettingService
          .updateEmailSMTPSetting(emailSMTPSetting)
          .subscribe(() => {
            this.translate.get('SMTPS.ADD.TOAST.EMAIL_SMTP_SETTING_UPDATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage); 
            }); 
    
            this.router.navigate(['/setting']);
          });
      } else {
        this.emailSmtpSettingService
          .addEmailSMTPSetting(emailSMTPSetting)
          .subscribe(() => {
            this.translate.get('SMTPS.ADD.TOAST.EMAIL_SMTP_SETTING_CREATED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage); 
            });
            this.router.navigate(['/setting']);
          });
      }
    } else {
      this.smtpSettingForm.markAllAsTouched();
    }
  }

  createBuildObject(): EmailSMTPSetting {
    const id = this.smtpSettingForm.get('id').value;
    const emailSMTPSetting: EmailSMTPSetting = {
      id: id,
      host: this.smtpSettingForm.get('host').value,
      userName: this.smtpSettingForm.get('userName').value,
      password: this.smtpSettingForm.get('password').value,
      encryption: this.smtpSettingForm.get('encryption').value,
      fromName: this.smtpSettingForm.get('fromName').value,
      port: this.smtpSettingForm.get('port').value,
      isDefault: this.smtpSettingForm.get('isDefault').value,
    };
    return emailSMTPSetting;
  }

}
