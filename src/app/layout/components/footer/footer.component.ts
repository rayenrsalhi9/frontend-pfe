import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CompanyProfileService } from "@app/shared/services/company-profile.service";

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
  companyProfile: any;
  private destroy$ = new Subject<void>();

  constructor(private companyProfileService: CompanyProfileService) {}

  ngOnInit(): void {
    this.getCompanyProfile();
  }

  getCompanyProfile() {
    this.companyProfileService
      .getCompanyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.companyProfile = data;
        },
        error: (error) => {
          console.error("Error fetching company profile in footer", error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
