import { User } from "./user";

export class DocumentPermission {
    id?: string;
    documentId: string;
    userId?: string;
    user?: User;
    type: string;
    isAllowDownload?: boolean;
}