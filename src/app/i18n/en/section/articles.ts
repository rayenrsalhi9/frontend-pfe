export const articles = {
  ARTICLES: {
    LIST: {
      TITLE: "Articles",
      DESCRIPTION:
        "Create, publish, and manage company news, announcements, and informational articles in one place.",
      TABLES: {
        SEARCH_BY_NAME: "Search by title",
        SEARCH_BY_CATEGORY: "Filter by category",
        SEARCH_BY_DATE: "Filter by date",
        PICTURE: "Cover Image",
        TITLE: "Title",
        CATEGORY: "Category",
        REPLIES: "Replies",
        CREATED_BY: "Created By",
        CREATED_AT: "Created At",
        PRIVACY: "Visibility",
        ACTIONS: "Actions",
      },
      PRIVACY: {
        PUBLIC: "Public",
        PRIVATE: "Private",
      },
      BUTTONS: {
        VIEW: "View",
        ADD: "Add Article",
        EDIT: "Edit",
        DELETE: "Delete",
        COMMENTS: "Comments",
      },
      EMPTY_STATE: {
        TITLE: "No articles found",
        DESCRIPTION: "No articles match the selected filters.",
      },
    },
    ADD: {
      LABEL: {
        TITLE: "Title",
        CATEGORY: "Category",
        DESCRIPTION: "Short Description",
        BODY: "Content",
        PRIVATE: "Private",
        USERS: "Users",
        PICTURE: "Cover Image",
        CHANGE_PICTURE: "Change Image",
      },
      BUTTONS: {
        SAVE: "Save",
        CANCEL: "Cancel",
      },
      ERRORS: {
        TITLE_IS_REQUIRED: "Title is required.",
        CATEGORY_IS_REQUIRED: "Category is required.",
        DESCRIPTION_IS_REQUIRED: "Short description is required.",
        BODY_IS_REQUIRED: "Content is required.",
        PICTURE_IS_REQUIRED: "Image is required.",
        ID_MISSING: "Article ID is missing.",
      },
      TOAST: {
        ADDED_SUCCESS: "Article created successfully.",
        UPDATED_SUCCESSFULLY: "Article updated successfully.",
      },
    },
    DELETE: {
      LABEL: {
        TITLE: "Delete Article",
        MESSAGE: "Are you sure you want to delete this article?",
        BUTTON: {
          CANCEL: "Cancel",
          CONFIRM: "Confirm",
        },
      },
      ERROR: {},
      TOAST: {
        ARTICLE_DELETED_SUCCESSFULLY: "Article deleted successfully.",
      },
    },
    CATEGORIES: {
      TITLE: "Article Categories",
      DESCRIPTION:
        "Organize articles into categories so users can find relevant content more easily.",
    },
    DELETE_COMMENT: {
      TITLE:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      BUTTON: {
        CANCEL: "Cancel",
        CONFIRM: "Delete",
      },
      TOAST: {
        DELETED_SUCCESSFULLY: "Comment deleted successfully",
        DELETED_ERROR: "Failed to delete comment",
      },
    },
    COPY_LINK: {
      SUCCESS: "Link copied to clipboard",
      UNSUPPORTED: "Could not copy link — please copy manually",
    },
    MODAL: {
      TITLE: "Article Comments",
      FETCHING: "Fetching conversation...",
      TOTAL_CONTRIBUTIONS: "Total Contributions",
      ADMIN_ONLY: "Super Admin Control Only",
      EMPTY_STATE: "No comments have been shared here yet.",
      TOOLTIP_DELETE: "Delete Comment",
      BUTTON_DISMISS: "Dismiss",
    },
  },
};
