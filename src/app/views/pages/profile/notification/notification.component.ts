import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'profile-notification',
    templateUrl: 'notification.component.html'
})

export class NotificationComponent implements OnInit, OnDestroy {

    @Output() openMobilePanel = new EventEmitter();

    notificationModel: any = {};
    private destroy$ = new Subject<void>();

    constructor(private translate: TranslateService) {}

    ngOnInit() {
        this.translate.stream('NOTIFICATION.SETTINGS').pipe(
            takeUntil(this.destroy$)
        ).subscribe((translations: any) => {
            this.notificationModel = {
                'product': [
                    {
                        icon: 'icon-message-circle',
                        title: translations.COMMENTS,
                        description: translations.COMMENTS_DESC,
                        value: true
                    },
                    {
                        icon: 'icon-mail',
                        title: translations.EMAIL,
                        description: translations.EMAIL_DESC,
                        value: true
                    },
                    {
                        icon: 'icon-star',
                        title: translations.ITEM_REVIEW,
                        description: translations.ITEM_REVIEW_DESC,
                        value: false
                    },
                    {
                        icon: 'icon-user-plus',
                        title: translations.FOLLOWS,
                        description: translations.FOLLOWS_DESC,
                        value: false
                    }
                ],
                'promo': [
                    {
                        icon: 'icon-box',
                        title: translations.NEW_PRODUCT,
                        description: translations.NEW_PRODUCT_DESC,
                        value: false
                    },
                    {
                        icon: 'icon-tag',
                        title: translations.PRODUCT_DISCOUNT,
                        description: translations.PRODUCT_DISCOUNT_DESC,
                        value: true
                    }
                ]
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onMobilePanelOpen() {
        this.openMobilePanel.emit()
    }
}