export const audit = {
  AUDIT: {
    LIST: {
      TITLE: "Audit Trail",
      DESCRIPTION:
        "Monitor document activity, access history, and permission updates to ensure security, compliance, and full traceability.",
      TABLE: {
        DATE: "Date",
        DOCUMENT_NAME: "Document Name",
        CATEGORY: "Category",
        OPERATION: "Operation",
        BY: "Performed By",
        TO: "Shared With",
        ROLE: "Assigned Role",
      },
      OPERATION: {
        CREATE: "Created",
        READ: "Viewed",
        DOWNLOAD: "Downloaded",
        DELETE: "Deleted",
        MODIFIED: "Modified",
        ADD_PERMISSION: "Permission Added",
        REMOVE_PERMISSION: "Permission Removed",
        SEND_EMAIL: "Email Sent",
        UNKNOWN: "Unknown",
      },
      LABELS: {
        SEARCH: "Search by document name",
        CATEGORY: "Filter by category",
        USER: "Filter by user",
      },
      EMPTY_STATE: {
        TITLE: "No audit records found",
        DESCRIPTION:
          "There are no audit entries matching the selected filters.",
      },
      DETAILS: {
        DOCUMENT: "Document",
        USER: "User",
        ROLE: "Role",
        CATEGORY: "Category",
        DATE: "Date",
        OPERATION: "Operation",
      },
    },
  },
};
