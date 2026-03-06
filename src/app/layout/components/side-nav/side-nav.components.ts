import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
} from "@angular/core";
import { NavMenuColor } from "@app/shared/types/app-config.interface";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "side-nav",
  templateUrl: "./side-nav.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.side-nav]": "true",
    "[class.nav-menu-collapse]": "collapse",
    "[class.nav-menu-quick-expand]": "quickExpand",
    "[class.nav-menu-light]": "color === 'light'",
    "[class.nav-menu-dark]": "color === 'dark'",
  },
})
export class SideNavComponent {
  @Input() collapse: boolean;
  @Input() quickExpand: boolean;
  @Input() color: NavMenuColor = "light";

  constructor(private securityService: SecurityService) {}

  logout(): void {
    this.securityService.logout();
  }
}
