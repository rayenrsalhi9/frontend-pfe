import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DocumentAuditTrail } from '@app/shared/enums/document-audit-trail';
import { DocumentInfo } from '@app/shared/enums/document-info';
import { DocumentOperation } from '@app/shared/enums/document-operation';
import { DocumentView } from '@app/shared/enums/document-view';
import { DocumentVersion } from '@app/shared/enums/documentVersion';
import { BasePreviewComponent } from '@app/shared/preview/base-preview/base-preview.component';
import { OverlayPanel } from '@app/shared/preview/overlay-panel/overlay-panel.service';
import { CommonService } from '@app/shared/services/common.service';
import { DocumentService } from '@app/shared/services/document.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core'; // Import TranslateService


@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.css']
})
export class DocumentHistoryComponent implements OnInit {

  width: any;
  maxHeight: any;
  panelClass: any;
  data: any;
  documentVersions: DocumentVersion[] = [];

  constructor(
    private overlay: OverlayPanel,
    private toastrService: ToastrService,
    private documentService: DocumentService,
    private commonService: CommonService,
    public bsModalRef: BsModalRef,
    private translate: TranslateService
    //private commandDialogService: CommonDialogService
  ) { }

  ngOnInit(): void {
  }

  onDocumentView(document: DocumentInfo) {
    const urls = document.url.split('.');
    const extension = urls[1];
    const documentView: DocumentView = {
      documentId: document.id,
      name: this.data.name,
      extension: extension,
      isRestricted: document.isAllowDownload,
      isVersion: true,
      id: this.data.id,
      isFromPreview: false,
    };
    this.overlay.open(BasePreviewComponent, {
      position: 'center',
      origin: 'global',
      panelClass: ['file-preview-overlay-container', 'white-background'],
      data: documentView,
    });
  }

  restoreDocumentVersion(version: DocumentVersion) {
    this.documentService
            .restoreDocumentVersion(this.data.id, version.id)
            .subscribe(() => {
              this.translate.get('DOCUMENTS.HISTORY.TOAST.VERSION_RESTORED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
                this.toastrService.success(translatedMessage); 
              });
              this.bsModalRef.hide();
            });
  }

  downloadDocument(version: DocumentVersion) {
    const doc: DocumentInfo = {
      id: version.id,
      isVersion: true,
      name: '',
      extension: '',
      url: '',
    };
    this.commonService
      .downloadDocument(doc.id, true)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.addDocumentTrail(
              this.data.id,
              DocumentOperation.Download.toString()
            );
            this.downloadFile(event);
          }
        },
        () => {
          this.translate.get('DOCUMENTS.HISTORY.TOAST.ERROR_WHILE_DOWNLOADING_DOCUMENT').subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage); 
          });
        }
      );
  }

  addDocumentTrail(id: string, operation: string) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: id,
      operationName: operation,
    };
    this.commonService
      .addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe();
  }

  private downloadFile(data: HttpResponse<Blob>) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = this.data.name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

}
