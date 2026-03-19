export const documents = {
  DOCUMENTS: {
    LIST: {
      TITLE: "Documents",
      DESCRIPTION:
        "Manage, organize, and access all your company documents securely from one place.",
      BUTTONS: {
        ADD: "Add Document",
        VIEW: "View",
        EDIT: "Edit",
        DOWNLOAD: "Download",
        UPLOAD: "Upload New Version",
        HISTORY: "Version History",
        COMMENT: "Comment",
        REMINDER: "Reminder",
        EMAIL: "Send Email",
        DELETE: "Delete",
      },
      TABLE: {
        NAME: "Document Name",
        CATEGORY: "Category",
        CREATED: "Created At",
        CREATOR: "Created By",
        UPDATED: "Updated At",
        ACTIONS: "Actions",
      },
      LABELS: {
        SEARCH: "Search by document name",
        TAGS: "Filter by tags",
        CATEGORY: "Filter by category",
        DATE: "Filter by date",
      },
      EMPTY_STATE: {
        TITLE: "No documents found",
        DESCRIPTION: "No documents match the selected filters.",
      },
    },

    ASSIGNED: {
      TITLE: "Assigned Documents",
      DESCRIPTION:
        "View and manage documents shared with you or assigned to your role.",
      BUTTONS: {
        ADD: "Add Document",
        VIEW: "View",
        EDIT: "Edit",
        DOWNLOAD: "Download",
        UPLOAD: "Upload New Version",
        HISTORY: "Version History",
        COMMENT: "Comment",
        REMINDER: "Reminder",
        EMAIL: "Send Email",
        DELETE: "Delete",
      },
      TABLE: {
        NAME: "Document Name",
        CATEGORY: "Category",
        CREATED: "Created At",
        CREATOR: "Created By",
        UPDATED: "Updated At",
        EXPIRE: "Expires At",
        ACTIONS: "Actions",
      },
      LABELS: {
        SEARCH: "Search by document name",
        TAGS: "Filter by tags",
        CATEGORY: "Filter by category",
        DATE: "Filter by date",
      },
      EMPTY_STATE: {
        TITLE: "No assigned documents found",
        DESCRIPTION: "No assigned documents match the selected filters.",
      },
    },

    ADD: {
      LABEL: {
        DOCUMENT_UPLOAD: "Upload Document",
        DOCUMENT_NAME: "Document Name",
        DOCUMENT_CATEGORY: "Category",
        DOCUMENT_DESCRIPTION: "Description",
        DOCUMENT_TAGS: "Tags",
        DOCUMENT_ROLE_ASSIGN: "Assign/Share with Roles",
        DOCUMENT_USER_ASSIGN: "Assign/Share with Users",
        DOCUMENT_PERIODE: "Specify Period",
        DOCUMENT_PERIODE_SD: "Start Date",
        DOCUMENT_PERIODE_ED: "End Date",
        DOCUMENT_DOWNLOAD: "Allow Download",
        DOCUMENT_SAVE: "Save",
        DOCUMENT_CANCEL: "Cancel",
      },
      ERROR: {
        DOCUMENT_IS_REQUIRED: "Document is required.",
        DOCUMENT_TYPE_IS_NOT_ALLOW: "This file type is not allowed.",
        NAME_IS_REQUIRED: "Document name is required.",
        CATEGORY_IS_REQUIRED: "Category is required.",
        START_DATE_IS_REQURED: "Start date is required.",
        END_DATE_IS_REQURED: "End date is required.",
      },
      TOAST: {
        DOCUMENT_SAVE_SUCCESSFULLY: "Document saved successfully.",
      },
    },

    EDIT: {
      LABEL: {
        DOCUMENT_EDIT: "Edit Document",
        DOCUMENT_NAME: "Document Name",
        DOCUMENT_CATEGORY: "Category",
        DOCUMENT_DESCRIPTION: "Description",
        DOCUMENT_TAGS: "Tags",
        DOCUMENT_SAVE: "Save",
        DOCUMENT_CANCEL: "Cancel",
      },
      ERROR: {
        NAME_IS_REQUIRED: "Document name is required.",
        CATEGORY_IS_REQUIRED: "Category is required.",
      },
      TOAST: {
        DOCUMENT_UPDATE_SUCCESSFULLY: "Document updated successfully.",
      },
    },

    UPLOAD: {
      LABEL: {
        DOCUMENT_NEW_VERSION: "Upload New Version",
        DOCUMENT_UPLOAD: "Document Upload",
        DOCUMENT_SAVE: "Save",
        DOCUMENT_CANCEL: "Cancel",
      },
      ERROR: {
        DOCUMENT_TYPE_IS_NOT_ALLOW: "This file type is not allowed.",
      },
      TOAST: {
        DOCUMENT_SAVE_SUCCESSFULLY: "Document uploaded successfully.",
      },
    },

    DOWNLOAD: {
      TOAST: {
        ERROR_WHILE_DOWNLOADING_DOCUMENT:
          "An error occurred while downloading the document.",
      },
    },

    HISTORY: {
      LABEL: {
        DOCUMENT_VERSION_HISTORY: "Version History",
        DOCUMENT_ADDED_BY: "Added By",
        DOCUMENT_CURRENT_VERSION: "Current Version",
        DOCUMENT_VISIBILITY: "Visibility",
        DOCUMENT_DOWNLOAD: "Download",
        DOCUMENT_RESTORE: "Restore",
      },
      ERROR: {},
      TOAST: {
        VERSION_RESTORED_SUCCESSFULLY: "Version restored successfully.",
        ERROR_WHILE_DOWNLOADING_DOCUMENT:
          "An error occurred while downloading the document.",
      },
    },

    COMMENT: {
      LABEL: {
        DOCUMENT_COMMENT_TITLE: "Document Comments",
        DOCUMENT_COMMENT: "Comment",
        DOCUMENT_ADD_COMMENT: "Add Comment",
        DOCUMENT_CLOSE: "Close",
      },
      ERROR: {
        COMMENT_IS_REQUIRED: "Comment is required.",
      },
      TOAST: {},
    },

    REMINDER: {
      LABEL: {
        DOCUMENT_REMINDER_TITLE: "Document Reminder",
        DOCUMENT_REMINDER_SUBJECT: "Subject",
        DOCUMENT_REMINDER_MESSAGE: "Message",
        DOCUMENT_REMINDER_REPEAT: "Repeat Reminder",
        DOCUMENT_REMINDER_SEND_EMAIL: "Send Email",
        DOCUMENT_REMINDER_USERS: "Select Users",
        DOCUMENT_REMINDER_FREQUENCY: "Frequency",
        DOCUMENT_REMINDER_WEEKDAYS: "Weekdays",
        DOCUMENT_REMINDER_DATE: "Reminder Date",
        DOCUMENT_REMINDER_START_DATE: "Start Date",
        DOCUMENT_REMINDER_END_DATE: "End Date",
        DOCUMENT_REMINDER_SAVE: "Save",
        DOCUMENT_REMINDER_CANCEL: "Cancel",
        SELECT_QUARTER_DATE: "Select Quarter Date",
        SELECT_REMINDER_MONTH: "Select Reminder Month",
        SELECT_REMINDER_DAY: "Select Reminder Day",
        SELECT_DATE: "Select Date",
      },
      ERROR: {
        SUBJECT_IS_REQUIRED: "Subject is required.",
        MESSAGE_IS_REQUIRED: "Message is required.",
        FREQUENCY_IS_REQUIRED: "Frequency is required.",
        PLEASE_SELECT_VALID_DAY: "Please select a valid day.",
        DATE_IS_REQUIRED: "Reminder date is required.",
        START_DATE_SHOULD_BE_GREATER_THEN_CURRENT_DATE_TIME:
          "Start date must be later than the current date and time.",
        START_DATE_IS_REQUIRED: "Start date is required.",
      },
      TOAST: {
        REMINDER_CREATED_SUCCESSFULLY: "Reminder created successfully.",
        REMINDER_UPDATED_SUCCESSFULLY: "Reminder updated successfully.",
      },
    },

    EMAIL: {
      LABEL: {
        DOCUMENT_EMAIL_TITLE: "Send Email",
        DOCUMENT_EMAIL_TO: "To",
        DOCUMENT_EMAIL_SUBJECT: "Subject",
        DOCUMENT_EMAIL_BODY: "Message",
        DOCUMENT_EMAIL_ATTACHMENT_DOCUMENT: "Attach Document",
        DOCUMENT_EMAIL_SEND: "Send",
      },
      ERROR: {
        TO_ADDRESS_IS_REQUIRED: "Recipient email address is required.",
        EMAIL_IS_NOT_PROPER_FORMAT:
          "Please enter a valid recipient email address.",
        SUBJECT_IS_REQUIRED: "Subject is required.",
        BODY_IS_REQUIRED: "Message body is required.",
      },
      TOAST: {
        EMAIL_SENT_SUCCESSFULLY: "Email sent successfully.",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "Are you sure?",
        MESSAGE: "Are you sure you want to delete this document?",
        BUTTON: {
          CANCEL: "Cancel",
          CONFIRM: "Confirm",
        },
      },
      ERROR: {},
      TOAST: {
        DOCUMENT_DELETED_SUCCESSFULLY: "Document deleted successfully.",
      },
    },

    SHARE: {
      LABEL: {
        DOCUMENT_SHARE: "Share Document",
        DOCUMENT_NAME: "Document Name",
        DESCRIPTION: "Description",
      },
      ERROR: {},
      TOAST: {
        PERMISSION_DELETED_SUCCESSFULLY: "Permission removed successfully.",
      },
    },
  },
};
