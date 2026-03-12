export const users = {
  USERS: {
    LIST: {
      TABLE: {
        EMAIL: "Email Address",
        FIRSTNAME: "First Name",
        LASTNAME: "Last Name",
        MOBILE: "Mobile Number",
        PHONE: "Phone Number",
        ACTION: "Actions",
      },
      BUTTONS: {
        ADD: "Add User",
        EDIT: "Edit",
        DELETE: "Delete",
        RESETPASSWORD: "Reset Password",
      },
    },

    ADD: {
      LABELS: {
        FIRSTNAME: "First Name",
        LASTNAME: "Last Name",
        MOBILE: "Mobile Number",
        EMAIL: "Email Address",
        PASSWORD: "Password",
        CONFPASSWORD: "Confirm Password",
        ROLES: "User Roles",
        MATRICULE: "Employee ID",
        DIRECTION: "Department",
      },

      BUTTONS: {
        ADD: "Save",
        CANCEL: "Cancel",
      },

      ERRORS: {
        FIRST_NAME_IS_REQUIRED: "First name is required",
        LAST_NAME_IS_REQUIRED: "Last name is required",
        MOBILE_IS_REQUIRED: "Mobile number is required",
        EMAIL_IS_REQUIRED: "Email address is required",
        PLEASE_ENTER_VALID_EMAIL: "Please enter a valid email address",
        PASSWORD_IS_REQUIRED: "Password is required",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "Password must contain at least one numeric digit",
        CONFIRM_PASSWORD_IS_REQUIRED: "Please confirm the password",
        PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
        DIRECTION_IS_REQUIRED: "Department is required",
        MATRICULE_IS_REQUIRED: "Employee ID is required",
      },

      TOAST: {
        ADDED_SUCCESS: "User created successfully",
        USER_UPDATED_SUCCESSFULLY: "User updated successfully",
        ADDED_ERROR: "An error occurred while creating the user",
        PLEASE_ENTER_PROPER_DATA:
          "Please provide valid and complete information",
      },
    },

    PASSWORD: {
      LABELS: {
        TITLE: "User Password",
        EMAIL: "Email Address",
        PASSWORD: "New Password",
        CONFPASSWORD: "Confirm Password",
      },

      BUTTONS: {
        SAVE: "Save",
        CANCEL: "Cancel",
      },

      ERRORS: {
        EMAIL_IS_REQUIRED: "Email address is required",
        PLEASE_ENTER_VALID_EMAIL: "Please enter a valid email address",
        PASSWORD_IS_REQUIRED: "Password is required",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "Password must contain at least one numeric digit",
        CONFIRM_PASSWORD_IS_REQUIRED: "Password confirmation is required",
        PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
      },

      TOAST: {
        SUCCESSFULLY_CHANGED_PASSWORD: "Password updated successfully",
      },
    },

    DELETE: {
      LABEL: {
        title: "Delete User",
        message:
          "Are you sure you want to permanently delete this user account?",
        button: {
          cancel: "Cancel",
          confirm: "Confirm",
        },
      },

      ERROR: {},

      TOAST: {
        USER_DELETED_SUCCESSFULLY: "User deleted successfully",
      },
    },
  },
};
