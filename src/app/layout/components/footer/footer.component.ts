import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { CompanyProfileService } from "@app/shared/services/company-profile.service";
import { CommonError } from "@app/core/error-handler/common-error";
import { CompanyProfile } from "@app/shared/enums/company-profile";
import { SecurityService } from "@app/core/security/security.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
  host: {
    "[class.footer]": "true",
  },
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  companyProfile: CompanyProfile | null = null;
  email: string = "";
  isAuthenticated$: Observable<boolean | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private companyProfileService: CompanyProfileService,
    private securityService: SecurityService,
  ) {}

  ngOnInit(): void {
    this.getCompanyProfile();
    this.isAuthenticated$ = this.securityService.SecurityObject.pipe(
      map((auth) => {
        if (auth === undefined) {
          return null;
        }
        if (auth === null) {
          return false;
        }
        return !!auth?.user?.userName && !!auth?.authorisation?.token;
      }),
    );
  }

  private getCompanyProfile(): void {
    this.companyProfileService
      .getCompanyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: CompanyProfile | CommonError) => {
          if (data && "title" in data) {
            this.companyProfile = data;
          }
        },
        error: (error) => {
          console.error("Error fetching company profile in footer", error);
        },
      });
  }

  onSubmitMembership(event: Event): void {
    event.preventDefault();
    console.log("Membership requested for email:", this.email);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
