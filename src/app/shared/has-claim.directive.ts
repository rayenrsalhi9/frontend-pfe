import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SecurityService } from '../core/security/security.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[hasClaim]'
})
export class HasClaimDirective {
  @Input() set hasClaim(claimType: any) {
    this.viewContainer.clear();

    const isNonEmptyString = typeof claimType === 'string' && claimType.trim() !== '';
    const isNonEmptyArray = Array.isArray(claimType) && claimType.length > 0;

    if (!isNonEmptyString && !isNonEmptyArray) {
      return;
    }

    if (this.securityService.hasClaim(claimType)) {
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private securityService: SecurityService) { }
}
