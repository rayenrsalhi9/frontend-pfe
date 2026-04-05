export const setting_profile = {
  PROFILE_SETTING: {
    TITLE: "Profile Settings",
    DESCRIPTION: "Manage your personal information and profile picture",

    LABELS: {
      PERSONAL_INFO: "Personal Information",
      FIRST_NAME: "First name",
      LAST_NAME: "Last name",
      MOBILE: "Mobile number",
      EMAIL: "Email",
      CHANGE_PICTURE: "Change picture",
    },

    PLACEHOLDERS: {
      FIRST_NAME: "Enter your first name",
      LAST_NAME: "Enter your last name",
      MOBILE: "Enter your mobile number",
      EMAIL: "Enter your email",
    },

    BUTTONS: {
      SAVE: "Save Changes",
      CANCEL: "Cancel",
      LOADING: "Saving...",
    },

    ERRORS: {
      FIRST_NAME_IS_REQUIRED: "First name is required",
      LAST_NAME_IS_REQUIRED: "Last name is required",
      MOBILE_IS_REQUIRED: "Mobile number is required",
      LOAD_FAILED: "Failed to load user data",
      UPDATE_FAILED: "Failed to update profile",
      VALIDATION_ERROR: "Please fill in all required fields correctly",
      INVALID_IMAGE_TYPE:
        "Please select a valid image (JPEG, PNG, GIF, or WebP)",
      FILE_TOO_LARGE: "Image size must be less than 5MB",
      READ_FAILED: "Failed to read the selected file",
    },

    TOAST: {
      PROFILE_UPDATED_SUCCESSFULLY: "Profile updated successfully",
    },

    ACCESSIBILITY: {
      PROFILE_PICTURE: "Profile picture",
      DEFAULT_AVATAR: "Default avatar",
    },

    PASSWORD: {
      LABELS: {
        TITLE: "User Password",
        EMAIL: "Email",
        PASSWORD: "Password",
        CONFPASSWORD: "Confirm Password",
        CURRENT_PASSWORD: "Current Password",
      },
      BUTTONS: {
        SAVE: "Save",
        CANCEL: "Cancel",
      },
      ERRORS: {
        CURRENT_PASSWORD_IS_REQUIRED: "Current password is required",
        PASSWORD_IS_REQUIRED: "Password is required",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "You have to enter at least one digit",
        CONFIRM_PASSWORD_IS_REQUIRED: "Confirm password is required",
        PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
      },
      TOAST: {
        SUCCESSFULLY_CHANGED_PASSWORD: "Password changed successfully",
      },
    },
  },
};
