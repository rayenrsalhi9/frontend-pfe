import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { CompanyProfileService } from "@app/shared/services/company-profile.service";

@Component({
  selector: "app-welcome-layout",
  templateUrl: "./welcome-layout.component.html",
  styleUrls: ["./welcome-layout.component.css"],
})
export class WelcomeLayoutComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean;
  companyProfile: any;
  private destroy$ = new Subject<void>();
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
    this.companyProfileService
      .getCompanyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          this.companyProfile = data;
        },
        (error) => {
          console.error("Error fetching company profile", error);
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
