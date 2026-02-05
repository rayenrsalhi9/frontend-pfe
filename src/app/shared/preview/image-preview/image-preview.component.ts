import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DocumentView } from '@app/shared/enums/document-view';
import { CommonService } from '@app/shared/services/common.service';
import { delay } from 'rxjs/operators';
import { OverlayPanelRef } from '../overlay-panel/overlay-panel-ref';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit, OnChanges {
  imageUrl: SafeUrl;
  isLoading = false;
  @Input() document: DocumentView;
  constructor(
    private overlayRef: OverlayPanelRef,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['document']) {
      this.getImage();
    }
  }

  getImage() {
    this.isLoading = true;
    this.commonService.downloadDocument(this.document.documentId, this.document.isVersion)
      .pipe(
        delay(500)
      )
      .subscribe(data => {
        this.isLoading = false;
        if (data.type === HttpEventType.Response) {
          const imgageFile = new Blob([data.body], { type: data.body.type });
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgageFile));
          this.ref.markForCheck();
        }
      }, (err) => {
        this.isLoading = false;
      })
  }

  onCancel() {
    this.overlayRef.close();
  }

}
