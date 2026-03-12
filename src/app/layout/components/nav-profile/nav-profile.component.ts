import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { UserService } from "@app/shared/services/user.service";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { environment } from "src/environments/environment";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Component({
  selector: "nav-profile",
  templateUrl: "./nav-profile.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.header-nav-item]": "true",
  },
})
export class NavProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: any;
  userImg: any = null;

  public bsModalRef: BsModalRef;

  constructor(
    private securityService: SecurityService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private modalService: BsModalService,
  ) {}

  profileMenuList = [
    {
      path: "/setting/profile",
      icon: "feather icon-user",
      claims: ["show"],
      item: "DROPDOWN_PROFILE.PROFILE",
    },
    {
      path: null,
      icon: "feather icon-lock",
      click: () => this.changePassword(),
      claims: ["show"],
      item: "DROPDOWN_PROFILE.CHANGE_PWD",
    },
    {
      path: "/setting",
      icon: "feather icon-mail",
      claims: ["EMAIL_MANAGE_SMTP_SETTINGS"],
      item: "DROPDOWN_PROFILE.SMTP",
    },
    {
      path: "/setting/company",
      icon: "feather icon-settings",
      claims: ["SETTING_MANAGE_PROFILE"],
      item: "DROPDOWN_PROFILE.SETTING",
    },
  ];

  getHost() {
    return environment.apiUrl;
  }

  getUserData() {
    this.securityService.SecurityObject.pipe(
      take(1),
      takeUntil(this.destroy$),
    ).subscribe((data: any) => {
      if (data) {
        this.userImg = data.user.avatar
          ? !data.user.avatar.startsWith("data:image")
            ? environment.apiUrl + data.user.avatar
            : data.user.avatar
          : null;
        this.user = data.user;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    this.getUserData();
    this.userService.data$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getUserData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changePassword() {
    const initialState = {
      data: Object.assign({}, this.user),
    };

    this.bsModalRef = this.modalService.show(ResetPasswordComponent, {
      initialState: initialState,
    });
  }

  logout() {
    this.securityService.logout();
  }
}
