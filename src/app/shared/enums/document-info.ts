import { DocumentUserPermission } from "./document-user-permission";
import { DocumentMetaData } from "./documentMetaData";
import { DocumentVersion } from "./documentVersion";

export interface DocumentInfo {
  id?: string;
  name?: string;
  url?: string;
  description?: string;
  createdDate?: Date;
  createdBy?: string;
  createdByEmail?: string;
  categoryId?: string;
  categoryName?: string;
  documentSource?: string;
  extension?: string;
  isVersion?: boolean;
  viewerType?: string;
  expiredDate?: Date;
  isAllowDownload?: boolean;
  documentVersions?: DocumentVersion[];
  documentMetaDatas?: DocumentMetaData[];
  documentUserPermissions?: DocumentUserPermission[];
  fileData?: any;
  isAssignUser?: any;
}
