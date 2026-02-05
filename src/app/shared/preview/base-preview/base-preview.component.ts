import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { DocumentAuditTrail } from '@app/shared/enums/document-audit-trail';
import { DocumentOperation } from '@app/shared/enums/document-operation';
import { DocumentView } from '@app/shared/enums/document-view';
import { ClonerService } from '@app/shared/services/clone.service';
import { CommonService } from '@app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { OVERLAY_PANEL_DATA } from '../overlay-panel/overlay-panel-data';
import { OverlayPanelRef } from '../overlay-panel/overlay-panel-ref';
import { OverlayPanel } from '../overlay-panel/overlay-panel.service';
@Component({
  selector: 'app-base-preview',
  templateUrl: './base-preview.component.html',
  styleUrls: ['./base-preview.component.scss']
})
export class BasePreviewComponent implements OnInit {
  type = '';
  currentDoc: DocumentView;
  isLoading: boolean = false;
  isDownloadFlag: boolean = false;

  constructor(
    public overlay: OverlayPanel,
    private commonService: CommonService,
    @Inject(OVERLAY_PANEL_DATA) public data: DocumentView,
    private clonerService: ClonerService,
    private overlayRef: OverlayPanelRef,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.onDocumentView(this.data);
  }

  closeToolbar() {
    this.overlayRef.close();
  }

  onDocumentView(document: DocumentView) {
    this.currentDoc = this.clonerService.deepClone<DocumentView>(document);
    const allowExtesions = environment.allowExtesions;
    const allowTypeExtenstion = allowExtesions.find(c => c.extentions.find(ext => ext === document.extension));
    this.type = allowTypeExtenstion ? allowTypeExtenstion.type : '';
    this.getIsDownloadFlag(document);
    this.addDocumentTrail(document.isVersion ? document.id : document.documentId, DocumentOperation.Read.toString());
  }

  addDocumentTrail(documentId: string, operation: string) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: documentId,
      operationName: operation
    };

    this.commonService.addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe(c => {
      });
  }

  getIsDownloadFlag(document: DocumentView) {
    this.commonService.isDownloadFlag(this.data.isVersion ? document.id : document.documentId, this.data.isFromPreview)
      .subscribe(c => {
        this.isDownloadFlag = c;
      });
  }

  downloadDocument(documentView: DocumentView) {
    this.commonService.downloadDocument(this.currentDoc.documentId, documentView.isVersion).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.addDocumentTrail(documentView.isVersion ? documentView.id : documentView.documentId, DocumentOperation.Download.toString());
          this.downloadFile(event, documentView);
        }
      },
      (error) => {
        this.toastrService.error('ERROR_WHILE_DOWNLOADING_DOCUMENT');
      }
    );
  }

  private downloadFile(data: HttpResponse<Blob>, documentView: DocumentView) {
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
