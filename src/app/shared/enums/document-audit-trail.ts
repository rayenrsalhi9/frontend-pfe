export interface DocumentAuditTrail {
  id?: string;
  documentId?: string;
  documentName?: string;
  createdBy?: string;
  createdByEmail?: string;
  createdDate?: Date;
  operationName: string;
  assignToUserId?: string;
  assignToRoleId?: string;
}
