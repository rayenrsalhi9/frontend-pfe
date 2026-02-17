import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { UserNotification } from "@app/shared/enums/notification";
import { NotificationSystem } from "@app/shared/services/notification-system.service";
import { NotificationService } from "@app/shared/services/notification.service";
import { PusherService } from "@app/shared/services/pusher.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "nav-notification",
  templateUrl: "./nav-notification.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.header-nav-item]": "true",
  },
  providers: [NotificationService],
})
export class NavNotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private currentUserId: string | null = null;
  private refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

  newNotificationCount = 0;
  notifications: UserNotification[] = [];
  refreshReminderTimeInMinute = 10;
  isUnReadNotification = false;
  momentLang: any;

  constructor(
    private notificationService: NotificationService,
    private securityService: SecurityService,
    private pusherService: PusherService,
    private notificationSystem: NotificationSystem,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
    this.loadData();
  }

  loadData() {
    // Method intentionally left empty - can be implemented later if needed
  }

  getTimeDistance(time: any) {
    // Method intentionally left empty - can be implemented later if needed
    return time;
  }

  ngOnInit(): void {
    this.securityService.SecurityObject.pipe(
      takeUntil(this.destroy$),
    ).subscribe((user) => {
      // Check if user exists and has user property before accessing
      if (user && user.user && user.user.id) {
        this.getNotification();
        this.currentUserId = user.user.id;
        this.pusherService.unsubscribeFromChannel(`user.${user.user.id}`);
        this.pusherService.subscribeToChannel(
          `user.${user.user.id}`,
          "notification",
          (data) => {
            if (data.type == "message") {
              this.getNotification();
              this.notificationSystem.sendNotification(data.data.message);
            }
          },
        );
      }
    });
    this.momentLang = this.translateService.currentLang?.split("_")[0] ?? "en";
  }

  getNotification() {
    if (!this.securityService.isUserAuthenticate()) {
      return;
    }

    this.notificationService
      .getNotification()
      .subscribe((notifications: UserNotification[]) => {
        this.newNotificationCount = notifications.filter(
          (c) => !c.isRead,
        ).length;
        this.notifications = notifications;
        this.isUnReadNotification = this.notifications.some((n) => !n.isRead);
        this.cd.detectChanges();

        if (this.refreshTimeoutId) {
          clearTimeout(this.refreshTimeoutId);
        }

        this.refreshTimeoutId = setTimeout(
          () => {
            this.getNotification();
          },
          this.refreshReminderTimeInMinute * 60 * 1000,
        );
      });
  }

  markAllAsReadNotification() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.getNotification();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
    }
    this.destroy$.next();
    this.destroy$.complete();
    if (this.currentUserId) {
      this.pusherService.unsubscribeFromChannel(`user.${this.currentUserId}`);
    }
  }
}
