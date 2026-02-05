import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './pipes/pipes.module';
import { HasClaimDirective } from './has-claim.directive';
import { AudioPreviewComponent } from './preview/audio-preview/audio-preview.component';
import { BasePreviewComponent } from './preview/base-preview/base-preview.component';
import { ImagePreviewComponent } from './preview/image-preview/image-preview.component';
import { OfficeViewerComponent } from './preview/office-viewer/office-viewer.component';
import { PdfViewerComponent } from './preview/pdf-viewer/pdf-viewer.component';
import { TextPreviewComponent } from './preview/text-preview/text-preview.component';
import { VideoPreviewComponent } from './preview/video-preview/video-preview.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { SusbcribeModalComponent } from './components/susbcribe-modal/susbcribe-modal.component';

@NgModule({
  declarations: [
    HasClaimDirective,
    ImagePreviewComponent,
    BasePreviewComponent,
    PdfViewerComponent,
    TextPreviewComponent,
    OfficeViewerComponent,
    AudioPreviewComponent,
    VideoPreviewComponent,
    ConfirmModalComponent,
    SusbcribeModalComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    TranslateModule,
    PipesModule,
    HasClaimDirective,
    ImagePreviewComponent,
    BasePreviewComponent,
    PdfViewerComponent,
    TextPreviewComponent,
    OfficeViewerComponent,
    AudioPreviewComponent,
    VideoPreviewComponent,
    ConfirmModalComponent,
    OverlayModule,
    NgxEmojiPickerModule
  ],
  imports: [
    PipesModule,
    OverlayModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    TranslateModule.forChild(),
    NgxEmojiPickerModule.forRoot()
  ],
  providers: [
  ]
})

export class SharedModule { }
