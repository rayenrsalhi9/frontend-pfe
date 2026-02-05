import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentView } from '@app/shared/enums/document-view';
import { CommonService } from '@app/shared/services/common.service';
import { OverlayPanelRef } from '../overlay-panel/overlay-panel-ref';

@Component({
  selector: 'app-text-preview',
  templateUrl: './text-preview.component.html',
  styleUrls: ['./text-preview.component.scss']
})
export class TextPreviewComponent implements OnChanges {
  textLines: string[] = [];
  isLoading = false;
  @Input() document: DocumentView;
  constructor(
    private commonService: CommonService,
    private overlayRef: OverlayPanelRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['document']) {
      this.readDocument();
    }
  }

  readDocument() {
    this.isLoading = true;
    this.commonService.readDocument(this.document.documentId, this.document.isVersion)
      .subscribe((data: { [key: string]: string[] }) => {
        this.isLoading = false;
        this.textLines = data['result'];
      }, (err) => {
        this.isLoading = false;
      });
  }

  onCancel() {
    this.overlayRef.close();
  }

}
