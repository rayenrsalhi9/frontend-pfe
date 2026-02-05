import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentAuditTrail } from '@app/shared/enums/document-audit-trail';
import { DocumentOperation } from '@app/shared/enums/document-operation';
import { SendEmail } from '@app/shared/enums/send-email';
import { CommonService } from '@app/shared/services/common.service';
import { EmailSendService } from '@app/shared/services/email-send.service';
/* import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; */
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-document-send-email',
  templateUrl: './document-send-email.component.html',
  styleUrls: ['./document-send-email.component.css']
})
export class DocumentSendEmailComponent implements OnInit {

  width: any;
  height: any;
  maxHeight: any;
  panelClass: any;
  data: any;

  emailForm: FormGroup;
 /*  public editor: any = ClassicEditor; */
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private emailSendService: EmailSendService,
    private commonService: CommonService,
    public bsModalRef: BsModalRef,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createEmailForm();
    this.bsModalRef.setClass('modal-lg')
  }

  closeDialog() {
    this.bsModalRef.hide();
  }

  createEmailForm() {
    this.emailForm = this.fb.group({
      id: [''],
      toAddress: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      documentId: [this.data.id, [Validators.required]],
    });
  }

  sendEmail() {
    if (!this.emailForm.valid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.emailSendService
      .sendEmail(this.buildObject())
      .subscribe(
        () => {
          this.addDocumentTrail();
          this.translate.get('DOCUMENTS.EMAIL.TOAST.EMAIL_SENT_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          });
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  buildObject() {
    const sendEmail: SendEmail = {
      documentId: this.emailForm.get('documentId').value,
      email: this.emailForm.get('toAddress').value,
      subject: this.emailForm.get('subject').value,
      message: this.emailForm.get('body').value,
    };
    return sendEmail;
  }

  addDocumentTrail() {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: this.data.id,
      operationName: DocumentOperation.Send_Email.toString(),
    };
    this.commonService
      .addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe(() => {
        this.bsModalRef.hide();
        this.isLoading = false;
      });
  }

}
