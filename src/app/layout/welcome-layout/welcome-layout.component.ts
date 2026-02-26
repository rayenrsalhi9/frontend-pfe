import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { CompanyProfileService } from "@app/shared/services/company-profile.service";

@Component({
  selector: "app-welcome-layout",
  templateUrl: "./welcome-layout.component.html",
  styleUrls: ["./welcome-layout.component.css"],
})
export class WelcomeLayoutComponent implements OnInit {
  @Input() isMobile: boolean;
  companyProfile: any;
  isMenuOpen: boolean = false;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private companyProfileService: CompanyProfileService,
    private securityService: SecurityService,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.securityService.SecurityObject.pipe(
      map((auth) => !!auth?.user?.userName && !!auth?.authorisation?.token),
    );
    this.securityService.isUserAuthenticate();
    this.getCompanyProfile();
  }

  getCompanyProfile() {
    this.companyProfileService.getCompanyProfile().subscribe((data: any) => {
      this.companyProfile = data;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
