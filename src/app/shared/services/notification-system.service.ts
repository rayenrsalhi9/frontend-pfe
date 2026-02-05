import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationSystem {
  constructor(
    private toastr: ToastrService,
  ) { }

  requestPermission() {
    const permission = Notification.requestPermission().then(
      (val: NotificationPermission) => {
        if (val == "denied") {
          this.toastr.error('Notification system not granted !')
        }
        if (val == "granted") { }
      },
      (failed: any) => { }
    )
  }

  sendNotification(body:any) {
    new Notification('GED | Document management system',{
      body:body
    })
  }

}
