export const category = {
  CATEGORY: {
    LIST: {
      TITLE: "Document Categories",
      DESCRIPTION:
        "Organize your documents into customizable categories for better structure, classification, and access management.",
      TABLE: {
        NAME: "Category Name",
        DESCRIPTION: "Description",
        CREATED: "Created At",
        ACTIONS: "Actions",
      },
      BUTTONS: {
        ADD: "Add Category",
        EDIT: "Edit",
        DELETE: "Delete",
      },
      EMPTY_STATE: {
        TITLE: "No categories found",
        DESCRIPTION: "No categories are available at the moment.",
      },
    },
    ADD: {
      NAME: "Category Name",
      DESCRIPTION: "Description",
      BUTTONS: {
        CATEGORY_SAVE: "Save",
        CATEGORY_CANCEL: "Cancel",
      },
      ERROR: {
        CATEGORY_NAME_IS_REQUIRED: "Category name is required.",
      },
      TOAST: {
        CATEGORY_SAVED_SUCCESSFULLY: "Category saved successfully.",
      },
    },
    DELETE: {
      LABEL: {
        TITLE: "Delete Category",
        MESSAGE: "Are you sure you want to delete this category?",
        BUTTON: {
          CANCEL: "Cancel",
          CONFIRM: "Confirm",
        },
      },
      ERROR: {},
      TOAST: {
        CATEGORY_DELETED_SUCCESSFULLY: "Category deleted successfully.",
      },
    },
  },
};
