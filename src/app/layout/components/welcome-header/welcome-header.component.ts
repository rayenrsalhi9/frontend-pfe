import { Component, OnInit, HostListener } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "app-welcome-header",
  templateUrl: "./welcome-header.component.html",
  styleUrls: ["./welcome-header.component.css"],
})
export class WelcomeHeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  isScrolled: boolean = false;
  isAuthenticated$: Observable<boolean | null>;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.securityService.SecurityObject.pipe(
      map((auth) => {
        if (auth === undefined) {
          return null; // Initial loading state
        }
        if (auth === null) {
          return false; // Confirmed not authenticated
        }
        return !!auth?.user?.userName && !!auth?.authorisation?.token;
      }),
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
