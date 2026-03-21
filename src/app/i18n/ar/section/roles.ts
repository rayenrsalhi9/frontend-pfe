export const roles = {
  ROLES: {
    LIST: {
      TITLE: "الأدوار",
      DESCRIPTION:
        "قم بتحديد وإدارة مستويات الوصول والصلاحيات الوظيفية للمستخدمين.",
      TABLE: {
        NAME: "اسم الدور",
        CREATED: "تاريخ الإنشاء",
        UPDATED: "تاريخ التحديث",
        ACTIONS: "الإجراءات",
      },
      BUTTONS: {
        ADD: "إضافة دور",
        EDIT: "تعديل",
        DELETE: "حذف",
      },
      EMPTY_STATE: {
        TITLE: "لم يتم العثور على أدوار",
        DESCRIPTION: "لا توجد أدوار متاحة في الوقت الحالي.",
      },
      LABELS: {
        SEARCH: "بحث عن أدوار...",
      },
    },

    ADD: {
      LABELS: {
        NAME: "اسم الدور",
        PERMISSIONS: "الصلاحيات",
        SELECTALL: "تحديد الكل",
      },
      BUTTONS: {
        ADD: "حفظ",
        UPDATE: "تحديث",
        CANCEL: "إلغاء",
      },
      ERRORS: {
        PLEASE_ENTER_ROLE_NAME: "يرجى إدخال اسم الدور.",
        PLEASE_SELECT_AT_LEAST_ONE_PERMISSION:
          "يرجى تحديد صلاحية واحدة على الأقل.",
      },
      TOAST: {
        ROLE_SAVED_SUCCESSFULLY: "تم حفظ الدور بنجاح.",
        ROLE_UPDATED_SUCCESSFULLY: "تم تحديث الدور بنجاح.",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "حذف الدور",
        MESSAGE: "هل أنت متأكد أنك تريد حذف هذا الدور؟",
        BUTTON: {
          CANCEL: "إلغاء",
          CONFIRM: "تأكيد",
        },
      },
      ERROR: {},
    },

    TOAST: {
      ROLE_DELETED_SUCCESSFULLY: "تم حذف الدور بنجاح.",
    },
  },
};
