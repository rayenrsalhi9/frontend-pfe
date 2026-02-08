import { Component, Input, OnInit } from '@angular/core';
import { SecurityService } from '@app/core/security/security.service';
import { CompanyProfileService } from '@app/shared/services/company-profile.service';

@Component({
  selector: 'app-welcome-layout',
  templateUrl: './welcome-layout.component.html',
  styleUrls: ['./welcome-layout.component.scss']
})
export class WelcomeLayoutComponent implements OnInit {

  @Input() isMobile: boolean
  companyProfile:any

  constructor(
    private companyProfileService: CompanyProfileService,
    private securityService: SecurityService,
  ) { }

  ngOnInit(): void {
    this.getCompanyProfile()
  }

  getCompanyProfile() {
    this.companyProfileService.getCompanyProfile().subscribe(
      (data:any)=>{
        console.log(data);
        this.companyProfile = data
      }
    )
  }

  checkConnection() {
    return this.securityService.isUserAuthenticate()
  }

  get currentYear(): number {
    return new Date().getFullYear()
  }
}
