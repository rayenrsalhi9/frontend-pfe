import { DocumentInfo } from './document-info';
import { User } from './user';

export enum NotificationType {
    Message = 'message',
    Reminder = 'reminder',
    Document = 'document',
    Other = 'other'
}

export interface UserNotificationInit {
    id?: string;
    userId?: string;
    message: string;
    createdDate: Date;
    documentName?: string;
    documentId?: string;
    isRead: boolean;
    document?: DocumentInfo;
    type?: NotificationType;
    user?: User;
    documents?: { name?: string };
}

export class UserNotification {
    id?: string;
    userId?: string;
    message: string;
    createdDate: Date;
    documentName?: string;
    documentId?: string;
    isRead: boolean;
    document?: DocumentInfo;
    type?: NotificationType;
    user?: User;

    constructor(init?: UserNotificationInit) {
        this.message = '';
        this.createdDate = new Date();
        this.isRead = false;
        if (init) {
            Object.assign(this, init);
            if (init.documents?.name) {
                this.documentName = init.documents.name;
            }
            if (this.user?.id) {
                this.userId = this.user.id;
            }
        }
    }
}
