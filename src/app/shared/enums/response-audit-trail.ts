export interface ResponseAuditTrail {
  id?: string;
  forumId?: string;
  forumTitle?: string;
  responseId?: string;
  responseType?: 'comment' | 'reaction';
  operationName: 'Created' | 'Updated' | 'Deleted';
  responseContent?: string;
  previousContent?: string;
  ipAddress?: string;
  userAgent?: string;
  createdBy?: string;
  createdByName?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
}