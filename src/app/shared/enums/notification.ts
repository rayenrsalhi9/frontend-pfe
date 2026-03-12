import { DocumentInfo } from './document-info';
import { User } from './user';

export enum NotificationType {
    Message = 'message',
    Reminder = 'reminder',
    Other = 'other'
}

export class UserNotification {
    id?: string;
    /**
     * userId is the canonical identifier (source-of-truth).
     * user is an optional denormalized object/cached payload.
     * When user is provided, userId should match user.id.
     * Use user?.firstName for templates, but rely on userId for identification.
     */
    userId?: string;
    message: string;
    createdDate: Date;
    documentName?: string;
    documentId?: string;
    isRead: boolean;
    document?: DocumentInfo;
    type?: NotificationType;
    user?: User;

    constructor(init?: Partial<UserNotification>) {
        if (init) {
            Object.assign(this, init);
            if (this.user?.id) {
                this.userId = this.user.id;
            }
        }
    }
}
