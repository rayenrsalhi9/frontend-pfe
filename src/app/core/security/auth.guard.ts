import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SecurityService } from "./security.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private securityService: SecurityService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    if (this.securityService.isGuestUser()) {
      this.router.navigate(["/"]);
      return false;
    }

    const fresh = await this.securityService.ensureFreshToken();

    if (!fresh) {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (this.securityService.isUserAuthenticate()) {
      const claimType: string = next.data["claimType"];
      if (claimType) {
        if (!this.securityService.hasClaim(claimType)) {
          this.toastr.error(`You don't have right to access this page`);
          this.router.navigate(["/"]);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }

  async canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    if (this.securityService.isGuestUser()) {
      this.router.navigate(["/"]);
      return false;
    }

    const fresh = await this.securityService.ensureFreshToken();

    if (!fresh) {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (this.securityService.isUserAuthenticate()) {
      const claimType: string = next.data["claimType"];
      if (claimType) {
        if (!this.securityService.hasClaim(claimType)) {
          this.toastr.error(`You don't have right to access this page `);
          return false;
        }
      }
      return true;
    } else {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    if (this.securityService.isGuestUser()) {
      this.router.navigate(["/"]);
      return false;
    }

    const fresh = await this.securityService.ensureFreshToken();

    if (
      fresh &&
      this.securityService.isUserAuthenticate()
    ) {
      return true;
    } else {
      const url = segments.map(s => s.path).join('/');
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: url },
      });
      return false;
    }
  }
}
