export const articles = {
  ARTICLES: {
    LIST: {
      TITLE: "المقالات",
      DESCRIPTION:
        "أنشئ وانشر وأدر أخبار الشركة والإعلانات والمقالات المعلوماتية من مكان واحد.",
      TABLES: {
        SEARCH_BY_NAME: "البحث حسب العنوان",
        SEARCH_BY_CATEGORY: "التصفية حسب الفئة",
        SEARCH_BY_DATE: "التصفية حسب التاريخ",
        PICTURE: "صورة الغلاف",
        TITLE: "العنوان",
        CATEGORY: "الفئة",
        CREATED_BY: "تم الإنشاء بواسطة",
        CREATED_AT: "تاريخ الإنشاء",
        REPLIES: "الردود",
        PRIVACY: "مستوى الوصول",
        ACTIONS: "الإجراءات",
      },
      PRIVACY: {
        PUBLIC: "عام",
        PRIVATE: "خاص",
      },
      BUTTONS: {
        VIEW: "عرض",
        ADD: "إضافة مقال",
        EDIT: "تعديل",
        DELETE: "حذف",
        COMMENTS: "التعليقات",
      },
      EMPTY_STATE: {
        TITLE: "لم يتم العثور على مقالات",
        DESCRIPTION: "لا توجد مقالات تطابق عوامل التصفية المحددة.",
      },
    },
    ADD: {
      LABEL: {
        TITLE: "العنوان",
        CATEGORY: "الفئة",
        DESCRIPTION: "وصف مختصر",
        BODY: "المحتوى",
        PRIVATE: "خاص",
        USERS: "المستخدمون",
        PICTURE: "صورة الغلاف",
        CHANGE_PICTURE: "تغيير الصورة",
      },
      BUTTONS: {
        SAVE: "حفظ",
        CANCEL: "إلغاء",
      },
      ERRORS: {
        TITLE_IS_REQUIRED: "العنوان مطلوب.",
        CATEGORY_IS_REQUIRED: "الفئة مطلوبة.",
        DESCRIPTION_IS_REQUIRED: "الوصف المختصر مطلوب.",
        BODY_IS_REQUIRED: "المحتوى مطلوب.",
        PICTURE_IS_REQUIRED: "الصورة مطلوبة.",
        ID_MISSING: "معرف المقال مفقود.",
      },
      TOAST: {
        ADDED_SUCCESS: "تم إنشاء المقال بنجاح.",
        UPDATED_SUCCESSFULLY: "تم تحديث المقال بنجاح.",
      },
    },
    DELETE: {
      LABEL: {
        TITLE: "حذف المقال",
        MESSAGE: "هل أنت متأكد أنك تريد حذف هذا المقال؟",
        BUTTON: {
          CANCEL: "إلغاء",
          CONFIRM: "تأكيد",
        },
      },
      ERROR: {},
      TOAST: {
        ARTICLE_DELETED_SUCCESSFULLY: "تم حذف المقال بنجاح.",
      },
    },

    DELETE_COMMENT: {
      TITLE: "هل أنت متأكد من رغبتك في حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.",
      BUTTON: {
        CANCEL: "إلغاء",
        CONFIRM: "حذف",
      },
      TOAST: {
        DELETED_SUCCESSFULLY: "تم حذف التعليق بنجاح",
        DELETED_ERROR: "فشل حذف التعليق",
      },
    },

    MODAL: {
      TITLE: "تعليقات المقال",
      FETCHING: "جارٍ جلب المحادثة...",
      TOTAL_CONTRIBUTIONS: "إجمالي المساهمات",
      ADMIN_ONLY: "تحكم المشرف المتميز فقط",
      EMPTY_STATE: "لم يتم مشاركة أي تعليقات هنا بعد.",
      TOOLTIP_DELETE: "حذف التعليق",
      BUTTON_DISMISS: "إغلاق",
    },

    CATEGORIES: {
      TITLE: "فئات المقالات",
      DESCRIPTION:
        "نظّم المقالات ضمن فئات لمساعدة المستخدمين على العثور على المحتوى المناسب بسهولة أكبر.",
    },
  },
};
