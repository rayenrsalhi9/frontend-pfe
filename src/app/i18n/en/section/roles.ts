export const roles = {
  "ROLES":{
    "LIST":{
      "TABLE":{
        "NAME":"Name",
        "CREATED":"Created at",
        "UPDATED":"Updated at",
        "ACTIONS":"Actions"
      },
      "BUTTONS":{
        "ADD":"Add role",
        "EDIT":"Edit",
        "DELETE":"Delete",
      }
    },
    "ADD":{
      "LABELS":{
        "NAME": "Role name",
        "PERMISSIONS": "Permissions",
        "SELECTALL":"Select all"
      },
      "BUTTONS":{
        "ADD":"Save",
        "UPDATE":"Update",
        "CANCEL":"Cancel"
      },
      "ERRORS": {
        "PLEASE_ENTER_ROLE_NAME": "Please enter role name",
        "PLEASE_SELECT_AT_LEAT_ONE_PERMISSION": "Please select at least one permission"
      },
      "TOAST": {
        "ROLE_SAVED_SUCCESSFULLY": "Role saved successfully",
        "ROLE_UPDATED_SUCCESSFULLY": "Role updated successfully"
      }
    },
    "DELETE": {
      "LABEL":{
        "title": "Do you want to delete this role?",
        "message": "Are you sure you want to delete this role",
        "button": {
         "cancel": "cancel",
         "confirm": "confirm"
        }
      },
      "ERROR":{},
      "TOAST":{
        "ROLE_DELETED_SUCCESSFULLY": "The role was successfully deleted"
      }
    },
    "TOAST":{
      "ROLE_DELETED_SUCCESSFULLY":"Role deleted successfully"
    }
  },
}
