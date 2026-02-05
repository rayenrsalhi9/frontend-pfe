import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentAuditTrail } from '@app/shared/enums/document-audit-trail';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { DocumentOperation } from '@app/shared/enums/document-operation';
import { DocumentMetaData } from '@app/shared/enums/documentMetaData';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentService } from '@app/shared/services/document.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {

  document: any;
  categories: any;
  documentForm: FormGroup;
  extension = '';

  get documentMetaTagsArray(): FormArray {
    return <FormArray>this.documentForm.get('documentMetaTags');
  }


  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private documentService: DocumentService,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.createDocumentForm();
    this.pushValuesDocumentMetatagArray();
    this.patchDocumentForm();
  }

  patchDocumentForm() {
    this.documentForm.patchValue({
      name: this.document.name,
      description: this.document.description,
      categoryId: this.document.categoryId,
      documentMetaDatas: this.document.documentMetaDatas,
    });
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      categoryId: ['', [Validators.required]],
      documentMetaTags: this.fb.array([]),
    });
  }

  SaveDocument() {
    if (this.documentForm.valid) {
      this.documentService
        .updateDocument(this.buildDocumentObject())
        .subscribe((c) => {
          this.translate.get('DOCUMENTS.EDIT.TOAST.DOCUMENT_UPDATE_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          });
          this.addDocumentTrail();
        });
    } else {
      this.markFormGroupTouched(this.documentForm);
    }
  }

  addDocumentTrail() {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: this.document.id,
      operationName: DocumentOperation.Modified.toString(),
    };
    this.commonService
      .addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe(() => {
        this.bsModalRef.hide();
      });
  }

  closeDialog() {
    this.bsModalRef.hide();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  buildDocumentObject(): DocumentInfo {
    const documentMetaTags = this.documentMetaTagsArray.value;
    const document: DocumentInfo = {
      id: this.document.id,
      categoryId: this.documentForm.get('categoryId').value,
      description: this.documentForm.get('description').value,
      name: this.documentForm.get('name').value,
      documentMetaDatas: [...documentMetaTags],
    };
    return document;
  }
  onDocumentCancel() {
    this.bsModalRef.content = null
    this.bsModalRef.hide()
    this.bsModalRef.hide();
  }

  onAddAnotherMetaTag() {
    const documentMetaTag: DocumentMetaData = {
      id: '',
      documentId: this.document && this.document.id ? this.document.id : '',
      metatag: '',
    };
    this.documentMetaTagsArray.insert(
      0,
      this.editDocmentMetaData(documentMetaTag)
    );
  }

  onDeleteMetaTag(index: number) {
    this.documentMetaTagsArray.removeAt(index);
  }

  buildDocumentMetaTag(): FormGroup {
    return this.fb.group({
      id: [''],
      documentId: [''],
      metatag: [''],
    });
  }

  pushValuesDocumentMetatagArray() {
    this.documentService
      .getdocumentMetadataById(this.document.id)
      .subscribe((result: DocumentMetaData[]) => {
        if (result.length > 0) {
          result.map((documentMetatag) => {
            this.documentMetaTagsArray.push(
              this.editDocmentMetaData(documentMetatag)
            );
          });
        } else {
          this.documentMetaTagsArray.push(this.buildDocumentMetaTag());
        }
      });
  }

  onMetatagChange(event: any, index: number) {
    const email = this.documentMetaTagsArray.at(index).get('metatag').value;
    if (!email) {
      return;
    }
    const emailControl = this.documentMetaTagsArray.at(index).get('metatag');
    emailControl.setValidators([Validators.required]);
    emailControl.updateValueAndValidity();
  }

  editDocmentMetaData(documentMetatag: DocumentMetaData): FormGroup {
    return this.fb.group({
      id: [documentMetatag.id],
      documentId: [documentMetatag.documentId],
      metatag: [documentMetatag.metatag],
    });
  }

}
