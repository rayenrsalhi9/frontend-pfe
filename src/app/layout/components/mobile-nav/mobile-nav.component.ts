import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { Store, Select } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import {
  AppConfig,
  NavMenuColor,
} from "@app/shared/types/app-config.interface";
import { UpdateMobileNavCollapse } from "@app/store/app-config/app-config.action";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "mobile-nav",
  templateUrl: "mobile-nav.component.html",
  host: {
    "[class.mobile-nav]": "true",
    "[class.is-open]": "isOpen",
    "[class.nav-menu-light]": "color === 'light'",
    "[class.nav-menu-dark]": "color === 'dark'",
  },
})
export class MobileNavComponent implements OnInit, OnDestroy {
  @Select((state: { app: AppConfig }) => state.app) app$: Observable<AppConfig>;

  @Input() isOpen: boolean;
  @Input() color: NavMenuColor = "light";

  subscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store,
    private securityService: SecurityService,
  ) {}

  ngOnInit() {
    this.subscription = this.app$.subscribe((app) => {
      this.isOpen = app.mobileNavCollapse;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeNav() {
    this.isOpen = false;
    this.store.dispatch(new UpdateMobileNavCollapse(this.isOpen));
  }

  onClicked() {
    this.closeNav();
  }

  logout(): void {
    this.closeNav();
    this.securityService.logout();
  }

  toggleNavCollapse() {
    this.isOpen = !this.isOpen;
    this.store.dispatch(new UpdateMobileNavCollapse(this.isOpen));
  }
}
