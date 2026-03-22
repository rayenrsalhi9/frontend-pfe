export const forum = {
  FORUM: {
    TITLE: "Community Forum",
    DESCRIPTION: "Browse, create, and manage discussion topics",

    TABLE: {
      TOPIC: "Topic",
      CATEGORY: "Category",
      REPLIES: "Replies",
      REACTIONS: "Reactions",
      ACTIVITY: "Last Activity",
      CREATED: "Created On",
      CLOSED: "Closed",
      CREATOR: "Author",
      STATUS: "Status",
      ACTIONS: "Actions",
      SEARCH_BY_NAME: "Search topics...",
      SEARCH_BY_CATEGORY: "Filter by category",
      SEARCH_BY_DATE: "Filter by date",
    },

    BUTTONS: {
      VIEW: "View Details",
      ADD: "New Topic",
      EDIT: "Edit Topic",
      DELETE: "Delete Topic",
      COMMENTS: "Comments",
    },

    ADD: {
      LABELS: {
        TITLE: "Topic Title",
        TAGS: "Tags",
        CATEGORY: "Category",
        CONTENT: "Description",
        PRIVATE: "Private Topic",
        CLOSED: "Mark as Closed",
      },
      BUTTONS: {
        SAVE: "Publish Topic",
        CANCEL: "Cancel",
      },
      ERROR: {
        TITLE: "Please enter a topic title",
        CATEGORY: "Please select a category",
        CONTENT: "Content cannot be empty",
      },
      TOAST: {
        SAVE_SUCCESSFULLY: "Topic created successfully",
      },
    },

    DELETE_COMMENT: {
      LABEL: {
        TITLE: "Delete Comment",
        MESSAGE:
          "Are you sure you want to delete this comment? This action cannot be undone.",
        BUTTON: {
          CANCEL: "Cancel",
          CONFIRM: "Delete",
        },
      },
      TOAST: {
        DELETED_SUCCESSFULLY: "Comment deleted successfully",
        DELETED_ERROR: "Failed to delete comment",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "Delete Topic",
        MESSAGE:
          "Are you sure you want to delete this topic? This action cannot be undone.",
        BUTTON: {
          CANCEL: "Cancel",
          CONFIRM: "Delete",
        },
      },
      ERROR: {},
      TOAST: {
        DELETED_SUCCESSFULLY: "Topic deleted successfully",
        DELETED_ERROR: "Failed to delete topic",
      },
    },

    COMMENT: {
      TITLE_COMMENT: "Comments",
      ADD_COMMENT: "Write a comment...",
    },

    STATUS: {
      OPEN: "Open",
      CLOSED: "Closed",
    },

    MODAL: {
      TITLE: "Discussion Comments",
      FETCHING: "Fetching conversation...",
      TOTAL_CONTRIBUTIONS: "Total Contributions",
      ADMIN_ONLY: "Super Admin Control Only",
      EMPTY_STATE: "No comments have been shared here yet.",
      TOOLTIP_DELETE: "Delete Comment",
      BUTTON_DISMISS: "Dismiss",
    },

    TOAST: {
      ERROR: "Failed to fetch forums",
    },
    CATEGORIES: {
      TITLE: "Forum Categories",
      DESCRIPTION:
        "Organize forum discussions into relevant categories to improve navigation and discoverability.",
    },
  },
};
