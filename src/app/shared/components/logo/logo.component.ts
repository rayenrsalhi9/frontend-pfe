import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { CompanyProfileService } from '@app/shared/services/company-profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'logo',
  templateUrl: './logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.logo]': 'true'
  }
})
export class LogoComponent implements OnInit {
  constructor(
    private companyProfileService: CompanyProfileService,
    private cdr: ChangeDetectorRef,
  ) { }

  @Input() logoType: 'logo' | 'fold' = 'logo'
  @Input() white = false
  private _height: number | string = 50;
  companylogo: any = null

  @Input() set height(val) {
    this._height = val
  }

  get height(): string {
    return this._height + 'px';
  }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.getCompanyProfile()
    this.companyProfileService.data$.subscribe(data => {
      if(data && data.logoUrl) {
        this.companylogo = data.logoUrl ? environment.apiUrl + data.logoUrl : this.getLogoTypeUrl()
        this.cdr.markForCheck()
      }
    })
  }

  getLogoTypeUrl() {
    const chain = ['logo']
    const urlPrefix = '/assets/images/logo/'
    if (this.logoType === 'fold') {
      chain.push('fold')
    }
    if (this.white) {
      chain.push('white')
    }
    let logoUrl = `${urlPrefix}${chain.join('-')}.png`
    return logoUrl
  }

  getCompanyProfile() {

    this.companyProfileService.getCompanyProfile().subscribe(
      (data: any) => {
        this.companyProfileService.refreshCompanyProfile(data)
        this.companylogo = data.logoUrl ? environment.apiUrl + data.logoUrl : this.getLogoTypeUrl()
        this.cdr.markForCheck()
      })
    this.cdr.detectChanges()
  }


}
