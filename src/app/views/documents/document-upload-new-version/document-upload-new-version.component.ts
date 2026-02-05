import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentVersion } from '@app/shared/enums/documentVersion';
import { FileInfo } from '@app/shared/enums/file-info';
import { DocumentService } from '@app/shared/services/document.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-document-upload-new-version',
  templateUrl: './document-upload-new-version.component.html',
  styleUrls: ['./document-upload-new-version.component.css']
})
export class DocumentUploadNewVersionComponent implements OnInit {

  width: any;
  maxHeight: any;
  panelClass: any;
  data: any;

  documentForm: FormGroup;
  extension = '';
  isFileUpload = false;
  showProgress = false;
  progress = 0;
  fileInfo: FileInfo;
  fileData: any;
  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef,
    private documentService: DocumentService,
    private toastrService: ToastrService,
    public bsModalRef: BsModalRef,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createDocumentForm()
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      url: [''],
      extension: ['', [Validators.required]],
    });
  }

  upload(files) {
    if (files.length === 0) return;
    this.extension = files[0].name.split('.').pop();
    this.showProgress = true;
    if (!this.fileExtesionValidation(this.extension)) {
      this.fileUploadExtensionValidation('');
      this.showProgress = false;
      this.cd.markForCheck();
      return;
    } else {
      this.fileUploadExtensionValidation('valid');
    }
    this.fileData = files[0];
    this.isFileUpload = true;
  }

  fileUploadValidation(fileName: string) {
    this.documentForm.patchValue({
      url: fileName,
    });
    this.documentForm.get('url').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileUploadExtensionValidation(extension: string) {
    this.documentForm.patchValue({
      extension: extension,
    });
    this.documentForm.get('extension').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileExtesionValidation(extesion: string): boolean {
    const allowExtesions = environment.allowExtesions;
    const allowTypeExtenstion = allowExtesions.find((c) =>
      c.extentions.find((ext) => ext === extesion)
    );
    return allowTypeExtenstion ? true : false;
  }

  SaveDocument() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const documentversion: DocumentVersion = {
      documentId: this.data.id,
      url: this.fileData.fileName,
      fileData: this.fileData,
      extension: this.extension,
    };
    this.documentService
      .saveNewVersionDocument(documentversion)
      .subscribe(() => {
        this.translate.get('DOCUMENTS.UPLOAD.TOAST.DOCUMENT_SAVE_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage); 
        });
        this.bsModalRef.hide();
      });
  }

  closeDialog() {
    this.bsModalRef.hide();
  }

}
