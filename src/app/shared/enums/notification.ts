import { DocumentInfo } from './document-info';
import { User } from './user';

export class UserNotification {
    id?: string;
    userId?: string;
    message: string;
    createdDate: Date;
    documentName?: string;
    documentId?: string;
    isRead:boolean;
    document?: DocumentInfo;
    type?: string;
    user?: User;
}
