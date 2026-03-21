export const roles = {
  ROLES: {
    LIST: {
      TITLE: "Roles",
      DESCRIPTION:
        "Define and manage access levels and functional permissions for your users.",
      TABLE: {
        NAME: "Role Name",
        CREATED: "Created At",
        UPDATED: "Updated At",
        ACTIONS: "Actions",
      },
      BUTTONS: {
        ADD: "Add Role",
        EDIT: "Edit",
        DELETE: "Delete",
      },
      EMPTY_STATE: {
        TITLE: "No roles found",
        DESCRIPTION: "No roles are available at the moment.",
      },
      LABELS: {
        SEARCH: "Search for roles...",
      },
    },

    ADD: {
      LABELS: {
        NAME: "Role Name",
        PERMISSIONS: "Permissions",
        SELECTALL: "Select All",
      },
      BUTTONS: {
        ADD: "Save",
        UPDATE: "Update",
        CANCEL: "Cancel",
      },
      ERRORS: {
        PLEASE_ENTER_ROLE_NAME: "Please enter a role name.",
        PLEASE_SELECT_AT_LEAST_ONE_PERMISSION:
          "Please select at least one permission.",
      },
      TOAST: {
        ROLE_SAVED_SUCCESSFULLY: "Role saved successfully.",
        ROLE_UPDATED_SUCCESSFULLY: "Role updated successfully.",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "Delete Role",
        MESSAGE: "Are you sure you want to delete this role?",
        BUTTON: {
          CANCEL: "Cancel",
          CONFIRM: "Confirm",
        },
      },
      ERROR: {},
      TOAST: {
        ROLE_DELETED_SUCCESSFULLY: "Role deleted successfully.",
      },
    },

    TOAST: {
      ROLE_DELETED_SUCCESSFULLY: "Role deleted successfully.",
    },
  },
};
