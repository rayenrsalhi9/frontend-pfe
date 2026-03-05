import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CompanyProfileService } from "@app/shared/services/company-profile.service";
import { CommonError } from "@app/core/error-handler/common-error";
import { CompanyProfile } from "@app/shared/enums/company-profile";

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
  private destroy$ = new Subject<void>();

  constructor(private companyProfileService: CompanyProfileService) {}

  ngOnInit(): void {
    this.getCompanyProfile();
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

  onRequestMembership(email: string): void {
    console.log(email);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
