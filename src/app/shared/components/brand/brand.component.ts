import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ged-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GedBrandComponent {
  /**
   * 'img' uses the static assets/images/logo/logo.png
   * 'dynamic' uses the <logo> component which fetches from the backend
   */
  @Input() logoType: 'img' | 'dynamic' = 'img';
  
  /**
   * Optional font size override for the brand text lines
   */
  @Input() fontSize?: string;
}
