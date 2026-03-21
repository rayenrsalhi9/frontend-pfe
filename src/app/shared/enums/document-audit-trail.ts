export interface DocumentAuditTrail {
  id?: string;
  documentId?: string;
  documentName?: string;
  createdBy?: string;
  createdByEmail?: string;
  createdDate?: Date;
  operationName: string;
  permissionUser?: string;
  permissionUserEmail?: string;
  permissionRole?: string
}
