import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "./pipes/pipes.module";
import { HasClaimDirective } from "./has-claim.directive";
import { AudioPreviewComponent } from "./preview/audio-preview/audio-preview.component";
import { BasePreviewComponent } from "./preview/base-preview/base-preview.component";
import { ImagePreviewComponent } from "./preview/image-preview/image-preview.component";
import { OfficeViewerComponent } from "./preview/office-viewer/office-viewer.component";
import { PdfViewerComponent } from "./preview/pdf-viewer/pdf-viewer.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { OverlayModule } from "@angular/cdk/overlay";
import { ConfirmModalComponent } from "./components/confirm-modal/confirm-modal.component";
import { NgxEmojiPickerModule } from "ngx-emoji-picker";
import { GedBrandComponent } from "./components/brand/brand.component";
import { LogoModule } from "./components/logo/logo.module";
import { SusbcribeModalComponent } from "./components/susbcribe-modal/susbcribe-modal.component";

@NgModule({
  declarations: [
    HasClaimDirective,
    ImagePreviewComponent,
    BasePreviewComponent,
    PdfViewerComponent,
    OfficeViewerComponent,
    AudioPreviewComponent,
    ConfirmModalComponent,
    GedBrandComponent,
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
    OfficeViewerComponent,
    AudioPreviewComponent,
    ConfirmModalComponent,
    GedBrandComponent,
    SusbcribeModalComponent,

    OverlayModule,
    NgxEmojiPickerModule,
    LogoModule,
  ],
  imports: [
    PipesModule,
    OverlayModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    TranslateModule.forChild(),
    NgxEmojiPickerModule,
    LogoModule,
  ],
  providers: [],
})
export class SharedModule {}
