export const documents = {
  "DOCUMENTS": {
    "LIST": {
      "BUTTONS": {
        "ADD": "Add document",
        "VIEW": "View",
        "EDIT": "Edit",
        "DOWNLOAD": "Download",
        "UPLOAD": "Upload new version",
        "HISTORY": "History",
        "COMMENT": "Comment",
        "REMINDER": "Reminder",
        "EMAIL": "Send email",
        "DELETE": "Delete"
      },
      "TABLE": {
        "NAME": "Name",
        "CATEGORY": "Category",
        "CREATED": "Created at",
        "CREATOR": "Created by",
        "UPDATED": "updated at",
        "ACTIONS": "Actions"
      },
      "LABELS": {
        "SEARCH": "Search by name",
        "TAGS": "Search by tags",
        "CATEGORY": "Search by categories",
        "DATE": "Search by date"
      }
    },
    "ASSIGNED": {
      "BUTTONS": {
        "ADD": "Add document",
        "VIEW": "View",
        "EDIT": "Edit",
        "DOWNLOAD": "Download",
        "UPLOAD": "Upload new version",
        "HISTORY": "History",
        "COMMENT": "Comment",
        "REMINDER": "Reminder",
        "EMAIL": "Send email",
        "DELETE": "Delete"
      },
      "TABLE": {
        "NAME": "Name",
        "CATEGORY": "Category",
        "CREATED": "Created at",
        "CREATOR": "Created by",
        "UPDATED": "updated at",
        "EXPIRE": "expire at",
        "ACTIONS": "Actions"
      },
      "LABELS": {
        "SEARCH": "Search by name",
        "TAGS": "Search by tags",
        "CATEGORY": "Search by categories",
        "DATE": "Search by date"
      }
    },
    "ADD": {
      "LABEL": {
        "DOCUMENT_UPLOAD": "Document Upload",
        "DOCUMENT_NAME": "Document name",
        "DOCUMENT_CATEGORY": "Category",
        "DOCUMENT_DESCRIPTION": "Description",
        "DOCUMENT_TAGS": "Meta Tags",
        "DOCUMENT_ROLE_ASSIGN": "Assign/share with roles",
        "DOCUMENT_USER_ASSIGN": "Assign/share with users",
        "DOCUMENT_PERIODE": "Specify the period",
        "DOCUMENT_PERIODE_SD": "Start date",
        "DOCUMENT_PERIODE_ED": "End date",
        "DOCUMENT_DOWNLOAD": "Allow download",
        "DOCUMENT_SAVE": "Save",
        "DOCUMENT_CANCEL": "Cancel",
      },
      "ERROR": {
        "DOCUMENT_IS_REQUIRED": "Document is required",
        "DOCUMENT_TYPE_IS_NOT_ALLOW": "Type not allowed",
        "NAME_IS_REQUIRED": "Name is required",
        "CATEGORY_IS_REQUIRED": "Category required",
        "START_DATE_IS_REQURED": "Start date is required",
        "END_DATE_IS_REQURED": "End date is required",
      },
      "TOAST": {
        "DOCUMENT_SAVE_SUCCESSFULLY":"Document saved successfully",
      }
    },
    "EDIT": {
      "LABEL":{
        "DOCUMENT_EDIT":"Edit Document",
        "DOCUMENT_NAME": "Document name",
        "DOCUMENT_CATEGORY": "Category",
        "DOCUMENT_DESCRIPTION": "Description",
        "DOCUMENT_TAGS": "Meta Tags",
        "DOCUMENT_SAVE": "Save",
        "DOCUMENT_CANCEL": "Cancel",
      },
      "ERROR":{
        "NAME_IS_REQUIRED":"Name is required",
        "CATEGORY_IS_REQUIRED": "Category required",
      },
      "TOAST":{  
       "DOCUMENT_UPDATE_SUCCESSFULLY":"Document updated successfully"
      }
    },
    "UPLOAD": {
      "LABEL":{
        "DOCUMENT_NEW_VERSION": "Upload new version",
        "DOCUMENT_UPLOAD": "Document upload",
        "DOCUMENT_SAVE": "Save",
        "DOCUMENT_CANCEL": "Cancel",
      },
      "ERROR":{
        "DOCUMENT_TYPE_IS_NOT_ALLOW": "Type not allowed",
      },
      "TOAST":{
        "DOCUMENT_SAVE_SUCCESSFULLY":"Document saved successfully",
      }
    },
    "DOWNLOAD":{
      "TOAST":{
        "ERROR_WHILE_DOWNLOADING_DOCUMENT": "Error while downloading document"
      }
    },
    "HISTORY": {
      "LABEL":{
        "DOCUMENT_VERSION_HISTORY":"Version history",
        "DOCUMENT_ADDED_BY": "Added By",
        "DOCUMENT_CURRENT_VERSION":"Current Version",
        "DOCUMENT_VISIBILITY":"Visibility",
        "DOCUMENT_DOWNLOAD":"Download",
        "DOCUMENT_RESTORE":"Restore",
      },
      "ERROR":{},
      "TOAST":{
        "VERSION_RESTORED_SUCCESSFULLY": "Version restored successfully",
        "ERROR_WHILE_DOWNLOADING_DOCUMENT": "Error while downloading document"
      }
    },
    "COMMENT": {
      "LABEL":{
        "DOCUMENT_COMMENT_TITLE":"Document comment",
        "DOCUMENT_COMMENT":"Comment",
        "DOCUMENT_ADD_COMMENT": "Add comment",
        "DOCUMENT_CLOSE": "CLOSE",
      },
      "ERROR":{"COMMENT_IS_REQUIRED":"The comment field is required"},
      "TOAST":{}
    },
    "REMINDER": {
      "LABEL":{
        "DOCUMENT_REMINDER_TITLE":"Document reminder",
        "DOCUMENT_REMINDER_SUBJECT":"Subject",
        "DOCUMENT_REMINDER_MESSAGE":"Message",
        "DOCUMENT_REMINDER_REPEAT":"Repeat reminder",
        "DOCUMENT_REMINDER_SEND_EMAIL":"Send email",
        "DOCUMENT_REMINDER_USERS":"Select users",
        "DOCUMENT_REMINDER_FREQUENCY":"Frequency",
        "DOCUMENT_REMINDER_WEEKDAYS":"Week days",
        "DOCUMENT_REMINDER_DATE":"Reminder Date",
        "DOCUMENT_REMINDER_START_DATE":"Start date",
        "DOCUMENT_REMINDER_END_DATE":"End date",
        "DOCUMENT_REMINDER_SAVE": "Save",
        "DOCUMENT_REMINDER_CANCEL": "Cancel",
        "SELECT_QUARTER_DATE":"Select Quarter Date", 
        "SELECT_REMINDER_MONTH":"Select Reminder Month", 
        "SELECT_REMINDER_DAY":"Select Reminder Day",
        "SELECT_DATE":"Select Date",
      },
      "ERROR":{
        "SUBJECT_IS_REQUIRED":"The subject filed is required",
        "MESSAGE_IS_REQUIRED":"The message filed is required",
        "FREQUENCY_IS_REQUIRED": "The frequency filed is required",
        "PLEASE_SELECT_VALID_DAY":"Please select a valid day",
        "DATE_IS_REQUIRED":"The date filed is required",
        "START_DATE_SHOULD_BE_GREATER_THEN_CURRENT_DATE_TIME":"The start date must be greater than the current date and time",
        "START_DATE_IS_REQUIRED":"The start date filed is required",
      },
      "TOAST":{
        "REMINDER_CREATED_SUCCESSFULLY": "Reminder created successfully",
        "REMINDER_UPDATED_SUCCESSFULLY": "Reminder updated successfully"
      }
    },
    "EMAIL": {
      "LABEL":{
        "DOCUMENT_EMAIL_TITLE":"Send Email",
        "DOCUMENT_EMAIL_TO":"To",
        "DOCUMENT_EMAIL_SUBJECT":"Subject",
        "DOCUMENT_EMAIL_BODY":"Body",
        "DOCUMENT_EMAIL_ATTACHMENT_DOCUMENT":"ATTACHMENT_DOCUMENT",
        "DOCUMENT_EMAIL_SEND":"Send"
      },
      "ERROR":{
        "TO_ADDRESS_IS_REQUIRED":"The To email address field is required",
        "EMAIL_IS_NOT_PROPER_FORMAT":"The To email address is not in a proper format",
        "SUBJECT_IS_REQUIRED":"The subject filed is required",
        "BODY_IS_REQUIRED":"The body filed is required",
      },
      "TOAST":{
        "EMAIL_SENT_SUCCESSFULLY":"Email send successfully"
      }
    },
    "DELETE": {
      "LABEL":{
        "title": "Are you sure?",
        "message": "Are you sure you want to delete this document?",
        "button": {
          "cancel": "Cancel",
          "confirm": "Confirm"
        }
      },
      "ERROR":{
      },
      "TOAST":{
        "DOCUMENT_DELETED_SUCCESSFULLY": "Document deleted successfully"
      }
    },
    "SHARE": {
      "LABEL": {   
        "DOCUMENT_SHARE": "Document Share",
        "DOCUMENT_NAME": "Document Name",
        "DESCRIPTION": "Description"
      },
      "ERROR": {},
      "TOAST": {
        "PERMISSION_DELETED_SUCCESSFULLY": "Permission deleted successfully"
      }
    }
  }
}
