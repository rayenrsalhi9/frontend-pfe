export const add = {
  ADD: {
    FORUM: {
      TITLE: "New forum thread",
      DESCRIPTION:
        "Start a discussion, ask a question, or share something with the community.",
      LABELS: {
        TITLE: "Title",
        CATEGORY: "Category",
        SUBCATEGORY: "Subcategory",
        TAGS: "Tags",
        CONTENT: "Content",
        PRIVATE: "Private thread",
      },
      PLACEHOLDERS: {
        TITLE: "What's your thread about?",
        TAGS: "Add a tag and press Enter…",
        CONTENT: "Write your thread content here…",
      },
      HINTS: {
        TAGS: "Press Enter after each tag. Tags help others find your thread.",
        PRIVATE:
          "Only members you invite will be able to see and reply to this thread.",
        REQUIRED_FIELDS: "Fields marked * are required",
      },
      BUTTONS: {
        SAVE: "Post thread",
        CANCEL: "Cancel",
      },
      ERRORS: {
        TITLE_REQUIRED: "Title is required",
        CATEGORY_REQUIRED: "Category is required",
        CONTENT_REQUIRED: "Content is required",
        TAGS_INVALID: "Invalid tag format",
        SAVE_FAILED: "Failed to post thread",
      },
      TOAST: {
        SUCCESS: "Thread posted successfully",
        ERROR: "Failed to post thread",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Title must be at least 5 characters",
        TITLE_MAX_LENGTH: "Title cannot exceed 200 characters",
        CONTENT_MIN_LENGTH: "Content must be at least 10 characters",
      },
    },

    BLOG: {
      TITLE: "New blog post",
      DESCRIPTION: "Write and publish a post for your audience.",
      LABELS: {
        PICTURE: "Cover image",
        TITLE: "Title",
        SUBTITLE: "Subtitle",
        CATEGORY: "Category",
        TAGS: "Tags",
        BODY: "Content",
        EXPIRATION: "Set expiration",
        STARTDATE: "Start date",
        ENDDATE: "End date",
        BANNER: "Show as banner",
        PRIVATE: "Private post",
      },
      PLACEHOLDERS: {
        PICTURE: "Upload a cover image",
        TITLE: "Give your post a title…",
        SUBTITLE: "A short description shown in previews…",
        TAGS: "Add a tag and press Enter…",
        BODY: "Write your post content here…",
      },
      HINTS: {
        EXPIRATION: "Set a date range during which this post will be visible.",
        BANNER: "Display this post as a featured banner on the home page.",
        PRIVATE: "Only you and invited members will be able to see this post.",
        REQUIRED_FIELDS: "Fields marked * are required",
      },
      BUTTONS: {
        SAVE: "Publish post",
        CANCEL: "Cancel",
        CHANGE_IMAGE: "Change image",
        UPLOAD_IMAGE: "Upload image",
      },
      ERRORS: {
        PICTURE_REQUIRED: "Cover image is required",
        TITLE_REQUIRED: "Title is required",
        SUBTITLE_REQUIRED: "Subtitle is required",
        CATEGORY_REQUIRED: "Category is required",
        BODY_REQUIRED: "Content is required",
        DATE_INVALID: "Invalid date range",
        IMAGE_INVALID: "Invalid image format",
        SAVE_FAILED: "Failed to publish post",
      },
      TOAST: {
        SUCCESS: "Blog post published successfully",
        ERROR: "Failed to publish blog post",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Title must be at least 5 characters",
        TITLE_MAX_LENGTH: "Title cannot exceed 200 characters",
        SUBTITLE_MIN_LENGTH: "Subtitle must be at least 10 characters",
        SUBTITLE_MAX_LENGTH: "Subtitle cannot exceed 300 characters",
        BODY_MIN_LENGTH: "Content must be at least 50 characters",
        IMAGE_TOO_LARGE: "Image size must be less than 5MB",
      },
    },

    ARTICLE: {
      TITLE: "New article",
      DESCRIPTION: "Create a news post or announcement for your community.",
      LABELS: {
        PICTURE: "Cover image",
        TITLE: "Title",
        CATEGORY: "Category",
        DESCRIPTION: "Short description",
        BODY: "Content",
        USERS: "Allowed users",
        PRIVATE: "Private article",
      },
      PLACEHOLDERS: {
        PICTURE: "Upload a cover image",
        TITLE: "Give your article a title…",
        DESCRIPTION: "Write a short summary shown in previews…",
        BODY: "Write your article content here…",
        USERS: "Search for users…",
      },
      HINTS: {
        PRIVATE:
          "Only you and the users you select will be able to see this article.",
        USERS: "Leave empty to allow all invited members to read this article.",
        REQUIRED_FIELDS: "Fields marked * are required",
      },
      BUTTONS: {
        SAVE: "Publish article",
        CANCEL: "Cancel",
        CHANGE_IMAGE: "Change image",
        UPLOAD_IMAGE: "Upload image",
      },
      ERRORS: {
        PICTURE_REQUIRED: "Cover image is required",
        TITLE_REQUIRED: "Title is required",
        CATEGORY_REQUIRED: "Category is required",
        DESCRIPTION_REQUIRED: "Short description is required",
        BODY_REQUIRED: "Content is required",
        IMAGE_INVALID: "Invalid image format",
        SAVE_FAILED: "Failed to publish article",
      },
      TOAST: {
        SUCCESS: "Article published successfully",
        ERROR: "Failed to publish article",
        UPDATED_SUCCESSFULLY: "Article updated successfully",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "Title must be at least 5 characters",
        TITLE_MAX_LENGTH: "Title cannot exceed 200 characters",
        DESCRIPTION_MIN_LENGTH: "Description must be at least 20 characters",
        DESCRIPTION_MAX_LENGTH: "Description cannot exceed 500 characters",
        BODY_MIN_LENGTH: "Content must be at least 50 characters",
        IMAGE_TOO_LARGE: "Image size must be less than 5MB",
      },
    },

    SHARED: {
      LABELS: {
        LOADING: "Loading…",
        REQUIRED: "Required field",
        OPTIONAL: "Optional",
        SELECT_PLACEHOLDER: "Select an option",
        MULTI_SELECT_PLACEHOLDER: "Select multiple options",
        TAG_PLACEHOLDER: "Add tags…",
        SEARCH_USERS: "Search users…",
        NO_OPTIONS: "No options available",
        NO_RESULTS: "No results found",
        BASIC_INFO: "Basic information",
        SETTINGS: "Settings",
      },
      BUTTONS: {
        BROWSE: "Browse",
        UPLOAD: "Upload",
        REMOVE: "Remove",
        CLEAR: "Clear",
        RESET: "Reset",
        CLOSE: "Close",
      },
      ERRORS: {
        NETWORK_ERROR: "Network error. Please try again",
        VALIDATION_ERROR: "Please correct the errors above",
        UNAUTHORIZED: "You don't have permission to perform this action",
        UNKNOWN_ERROR: "An unexpected error occurred",
      },
      VALIDATION: {
        MIN_LENGTH: "Must be at least {{min}} characters",
        MAX_LENGTH: "Cannot exceed {{max}} characters",
        PATTERN_INVALID: "Invalid format",
        EMAIL_INVALID: "Invalid email address",
        URL_INVALID: "Invalid URL format",
        DATE_INVALID: "Invalid date format",
      },
    },
  },

  EDIT: {
    ARTICLE: {
      TITLE: "Edit article",
      BUTTONS: {
        UPDATE: "Update article",
      },
    },
  },
};
