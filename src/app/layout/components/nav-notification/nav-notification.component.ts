import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SecurityService } from '@app/core/security/security.service';
import { UserNotification } from '@app/shared/enums/notification';
import { NotificationSystem } from '@app/shared/services/notification-system.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { PusherService } from '@app/shared/services/pusher.service';
import { TimeSince } from '@app/shared/utils/TimeSince'
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'nav-notification',
  templateUrl: './nav-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.header-nav-item]': 'true'
  },
  providers: [
    NotificationService
  ],
})
export class NavNotificationComponent implements OnInit {

  newNotificationCount = 0;
  notifications: UserNotification[] = [];
  refereshReminderTimeInMinute = 10;
  isUnReadNotification = false;
  momentLang:any

  constructor(
    private notificationService: NotificationService,
    private securityService: SecurityService,
    private pusherService: PusherService,
    private notificationSystem:NotificationSystem,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
    this.loadData();

  }

  loadData() {
    /* this.notificationSvc.getNotificationList().subscribe(data => {
        this.notificationList = [...data]
    }); */
  }

  getTimeDistance(time: any) {
    //return TimeSince(time)
    //return time

    /* console.log(time);

    let date = moment(time,'YYYY/MM/DD[T]HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss');

    console.log(date);


    return date; */

  }

  ngOnInit(): void {
    this.securityService.SecurityObject.subscribe(user=>{

      this.getNotification()
      this.pusherService.unsubscribeFromChannel(`user.${user.user.id}`)
      this.pusherService.subscribeToChannel(`user.${user.user.id}`, 'notification', (data) => {
        if (data.type == 'message') {
          this.getNotification()
          this.notificationSystem.sendNotification(data.data.message)
        }
      })
    })
    this.momentLang = this.translateService.currentLang.split('_')[0]
  }

  getNotification() {
    if (!this.securityService.isUserAuthenticate()) {
      return;
    }

    this.notificationService
      .getNotification()
      .subscribe((notifications: UserNotification[]) => {

        this.newNotificationCount = notifications.filter(
          (c) => !c.isRead
        ).length;
        this.notifications = notifications;
        this.isUnReadNotification = this.notifications.some((n) => !n.isRead);
        this.cd.detectChanges();

        setTimeout(() => {
          this.getNotification();
        }, this.refereshReminderTimeInMinute * 60 * 1000);
      });
  }

  markAllAsReadNotification() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.getNotification();
    });
  }
}
