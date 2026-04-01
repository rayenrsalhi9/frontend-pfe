export const add = {
  ADD: {
    FORUM: {
      TITLE: "موضوع منتدى جديد",
      DESCRIPTION:
        "ابدأ نقاشًا، اطرح سؤالاً، أو شارك شيئًا مع المجتمع.",
      LABELS: {
        TITLE: "العنوان",
        CATEGORY: "الفئة",
        SUBCATEGORY: "الفئة الفرعية",
        TAGS: "العلامات",
        CONTENT: "المحتوى",
        PRIVATE: "موضوع خاص",
      },
      PLACEHOLDERS: {
        TITLE: "ما هو موضوعك؟",
        TAGS: "أضف علامة واضغط على Enter…",
        CONTENT: "اكتب محتوى موضوعك هنا…",
      },
      HINTS: {
        TAGS: "اضغط على Enter بعد كل علامة. تساعد العلامات الآخرين في العثور على موضوعك.",
        PRIVATE:
          "سيتمكن فقط الأعضاء الذين تدعوهم من رؤية هذا الموضوع والرد عليه.",
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
      },
      BUTTONS: {
        SAVE: "نشر الموضوع",
        CANCEL: "إلغاء",
      },
      ERRORS: {
        TITLE_REQUIRED: "العنوان مطلوب",
        CATEGORY_REQUIRED: "الفئة مطلوبة",
        CONTENT_REQUIRED: "المحتوى مطلوب",
        TAGS_INVALID: "تنسيق العلامة غير صالح",
        SAVE_FAILED: "فشل نشر الموضوع",
      },
      TOAST: {
        SUCCESS: "تم نشر الموضوع بنجاح",
        ERROR: "فشل نشر الموضوع",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "يجب أن يكون العنوان على الأقل 5 أحرف",
        TITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان 200 حرف",
        CONTENT_MIN_LENGTH: "يجب أن يكون المحتوى على الأقل 10 أحرف",
      },
    },

    BLOG: {
      TITLE: "مقالة مدونة جديدة",
      DESCRIPTION: "اكتب وانشر مقالة لجمهورك.",
      LABELS: {
        PICTURE: "صورة الغلاف",
        TITLE: "العنوان",
        SUBTITLE: "العنوان الفرعي",
        CATEGORY: "الفئة",
        TAGS: "العلامات",
        BODY: "المحتوى",
        EXPIRATION: "تعيين انتهاء الصلاحية",
        STARTDATE: "تاريخ البدء",
        ENDDATE: "تاريخ الانتهاء",
        BANNER: "عرض كشعار",
        PRIVATE: "مقالة خاصة",
      },
      PLACEHOLDERS: {
        PICTURE: "تحميل صورة غلاف",
        TITLE: "أعطِ مقالتك عنوانًا…",
        SUBTITLE: "وصف قصير يُعرض في المعاينات…",
        TAGS: "أضف علامة واضغط على Enter…",
        BODY: "اكتب محتوى مقالتك هنا…",
      },
      HINTS: {
        EXPIRATION: "عيّن نطاقًا زمنيًا ستكون فيه هذه المقالة مرئية.",
        BANNER: "عرض هذه المقالة كشعار مميز على الصفحة الرئيسية.",
        PRIVATE: "سيتمكن فقط أنت والأعضاء المدعوين من رؤية هذه المقالة.",
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
      },
      BUTTONS: {
        SAVE: "نشر المقالة",
        CANCEL: "إلغاء",
        CHANGE_IMAGE: "تغيير الصورة",
        UPLOAD_IMAGE: "تحميل صورة",
      },
      ERRORS: {
        PICTURE_REQUIRED: "صورة الغلاف مطلوبة",
        TITLE_REQUIRED: "العنوان مطلوب",
        SUBTITLE_REQUIRED: "العنوان الفرعي مطلوب",
        CATEGORY_REQUIRED: "الفئة مطلوبة",
        BODY_REQUIRED: "المحتوى مطلوب",
        DATE_INVALID: "نطاق التاريخ غير صالح",
        IMAGE_INVALID: "تنسيق الصورة غير صالح",
        SAVE_FAILED: "فشل نشر المقالة",
      },
      TOAST: {
        SUCCESS: "تم نشر مقالة المدونة بنجاح",
        ERROR: "فشل نشر مقالة المدونة",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "يجب أن يكون العنوان على الأقل 5 أحرف",
        TITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان 200 حرف",
        SUBTITLE_MIN_LENGTH: "يجب أن يكون العنوان الفرعي على الأقل 10 أحرف",
        SUBTITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان الفرعي 300 حرف",
        BODY_MIN_LENGTH: "يجب أن يكون المحتوى على الأقل 50 حرفًا",
        IMAGE_TOO_LARGE: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
      },
    },

    ARTICLE: {
      TITLE: "مقالة جديدة",
      DESCRIPTION: "أنشئ منشور أخبار أو إعلان لمجتمعك.",
      LABELS: {
        PICTURE: "صورة الغلاف",
        TITLE: "العنوان",
        CATEGORY: "الفئة",
        DESCRIPTION: "وصف قصير",
        BODY: "المحتوى",
        USERS: "المستخدمون المسموح بهم",
        PRIVATE: "مقالة خاصة",
      },
      PLACEHOLDERS: {
        PICTURE: "تحميل صورة غلاف",
        TITLE: "أعطِ مقالتك عنوانًا…",
        DESCRIPTION: "اكتب ملخصًا قصيرًا يُعرض في المعاينات…",
        BODY: "اكتب محتوى مقالتك هنا…",
        USERS: "البحث عن المستخدمين…",
      },
      HINTS: {
        PRIVATE:
          "سيتمكن فقط أنت والمستخدمون الذين تختارهم من رؤية هذه المقالة.",
        USERS: "اتركه فارغًا للسماح لجميع الأعضاء المدعوين بقراءة هذه المقالة.",
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
      },
      BUTTONS: {
        SAVE: "نشر المقالة",
        CANCEL: "إلغاء",
        CHANGE_IMAGE: "تغيير الصورة",
        UPLOAD_IMAGE: "تحميل صورة",
      },
      ERRORS: {
        PICTURE_REQUIRED: "صورة الغلاف مطلوبة",
        TITLE_REQUIRED: "العنوان مطلوب",
        CATEGORY_REQUIRED: "الفئة مطلوبة",
        DESCRIPTION_REQUIRED: "الوصف القصير مطلوب",
        BODY_REQUIRED: "المحتوى مطلوب",
        IMAGE_INVALID: "تنسيق الصورة غير صالح",
        SAVE_FAILED: "فشل نشر المقالة",
      },
      TOAST: {
        SUCCESS: "تم نشر المقالة بنجاح",
        ERROR: "فشل نشر المقالة",
        UPDATED_SUCCESSFULLY: "تم تحديث المقالة بنجاح",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "يجب أن يكون العنوان على الأقل 5 أحرف",
        TITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان 200 حرف",
        DESCRIPTION_MIN_LENGTH: "يجب أن يكون الوصف على الأقل 20 حرفًا",
        DESCRIPTION_MAX_LENGTH: "لا يمكن أن يتجاوز الوصف 500 حرف",
        BODY_MIN_LENGTH: "يجب أن يكون المحتوى على الأقل 50 حرفًا",
        IMAGE_TOO_LARGE: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
      },
    },

    SHARED: {
      LABELS: {
        LOADING: "جاري التحميل…",
        REQUIRED: "حقل مطلوب",
        OPTIONAL: "اختياري",
        SELECT_PLACEHOLDER: "اختر خيارًا",
        MULTI_SELECT_PLACEHOLDER: "اختر عدة خيارات",
        TAG_PLACEHOLDER: "أضف علامات…",
        SEARCH_USERS: "البحث عن المستخدمين…",
        NO_OPTIONS: "لا توجد خيارات متاحة",
        NO_RESULTS: "لم يتم العثور على نتائج",
        BASIC_INFO: "المعلومات الأساسية",
        SETTINGS: "الإعدادات",
      },
      BUTTONS: {
        BROWSE: "تصفح",
        UPLOAD: "تحميل",
        REMOVE: "إزالة",
        CLEAR: "مسح",
        RESET: "إعادة تعيين",
        CLOSE: "إغلاق",
      },
      ERRORS: {
        NETWORK_ERROR: "خطأ في الشبكة. حاول مرة أخرى",
        VALIDATION_ERROR: "يرجى تصحيح الأخطاء أعلاه",
        UNAUTHORIZED: "ليس لديك إذن لتنفيذ هذا الإجراء",
        UNKNOWN_ERROR: "حدث خطأ غير متوقع",
      },
      VALIDATION: {
        MIN_LENGTH: "يجب أن يكون على الأقل {{min}} أحرف",
        MAX_LENGTH: "لا يمكن أن يتجاوز {{max}} أحرف",
        PATTERN_INVALID: "تنسيق غير صالح",
        EMAIL_INVALID: "عنوان بريد إلكتروني غير صالح",
        URL_INVALID: "تنسيق عنوان URL غير صالح",
        DATE_INVALID: "تنسيق تاريخ غير صالح",
      },
    },
  },

  EDIT: {
    ARTICLE: {
      TITLE: "تعديل المقالة",
      BUTTONS: {
        UPDATE: "تحديث المقالة",
      },
    },
  },
};