import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentView } from '@app/shared/enums/document-view';
import { CommonService } from '@app/shared/services/common.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnChanges {
  @Input() document: DocumentView;
  loadingTime: number = 2000;
  constructor(
    private commonService: CommonService) {
  }
  documentUrl: any = null;
  isLoading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['document']) {
      this.getDocument();
    }
  }

  getDocument() {
    this.isLoading = true;
    this.commonService.downloadDocument(this.document.documentId, this.document.isVersion)
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          this.isLoading = false;
          this.downloadFile(event);
        }
      }, (err) => {
        this.isLoading = false;
      });
  }

  downloadFile(data: HttpResponse<Blob>) {
    this.documentUrl = new Blob([data.body], { type: data.body.type });
  }
}
