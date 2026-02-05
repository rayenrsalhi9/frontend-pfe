import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { AudioPreviewComponent } from '../audio-preview/audio-preview.component';
import { OverlayPanelRef } from '../overlay-panel/overlay-panel-ref';
import { CommonService } from '@app/shared/services/common.service';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.scss']
})
export class VideoPreviewComponent extends AudioPreviewComponent implements OnChanges {
  constructor(
    public override overlayRef: OverlayPanelRef,
    public override commonService: CommonService
  ) {
    super(overlayRef, commonService);
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes['document']) {
      this.getDocument();
    }
  }

}
