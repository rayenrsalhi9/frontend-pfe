export const add = {
  ADD: {
    FORUM: {
      TITLE: "موضوع جديد في المنتدى",
      DESCRIPTION: "ابدأ نقاشًا، اطرح سؤالًا، أو شارك شيئًا مع المجتمع.",
      LABELS: {
        TITLE: "العنوان",
        CATEGORY: "الفئة",
        SUBCATEGORY: "الفئة الفرعية",
        TAGS: "الوسوم",
        CONTENT: "المحتوى",
        PRIVATE: "موضوع خاص",
      },
      PLACEHOLDERS: {
        TITLE: "ما موضوع نقاشك؟",
        TAGS: "أضف وسمًا واضغط Enter…",
        CONTENT: "اكتب محتوى الموضوع هنا…",
      },
      HINTS: {
        TAGS: "اضغط Enter بعد كل وسم. تساعد الوسوم الآخرين في العثور على موضوعك.",
        PRIVATE: "فقط الأعضاء الذين تدعوهم يمكنهم رؤية هذا الموضوع والرد عليه.",
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
        TAGS_INVALID: "تنسيق الوسم غير صالح",
        SAVE_FAILED: "فشل نشر الموضوع",
      },
      TOAST: {
        SUCCESS: "تم نشر الموضوع بنجاح",
        ERROR: "فشل نشر الموضوع",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "يجب أن يحتوي العنوان على 5 أحرف على الأقل",
        TITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان 200 حرف",
        CONTENT_MIN_LENGTH: "يجب أن يحتوي المحتوى على 10 أحرف على الأقل",
      },
    },

    BLOG: {
      TITLE: "مقالة جديدة",
      DESCRIPTION: "اكتب وانشر مقالة لجمهورك.",
      LABELS: {
        PICTURE: "صورة الغلاف",
        TITLE: "العنوان",
        SUBTITLE: "العنوان الفرعي",
        CATEGORY: "الفئة",
        TAGS: "الوسوم",
        BODY: "المحتوى",
        EXPIRATION: "تحديد فترة الظهور",
        STARTDATE: "تاريخ البداية",
        ENDDATE: "تاريخ النهاية",
        BANNER: "عرض كبانر",
        PRIVATE: "مقال خاص",
        USERS: "المستخدمون المسموح لهم",
      },
      PLACEHOLDERS: {
        PICTURE: "قم برفع صورة غلاف",
        TITLE: "أدخل عنوان المقال…",
        SUBTITLE: "وصف قصير يظهر في المعاينة…",
        TAGS: "أضف وسمًا واضغط Enter…",
        BODY: "اكتب محتوى المقال هنا…",
        USERS: "ابحث عن مستخدمين…",
      },
      HINTS: {
        EXPIRATION: "حدد الفترة التي سيكون المقال خلالها مرئيًا.",
        BANNER: "عرض هذا المقال كبانر في الصفحة الرئيسية.",
        PRIVATE: "فقط أنت والأعضاء المدعوون يمكنهم رؤية هذا المقال.",
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
        USERS: "اتركه فارغًا للسماح لجميع الأعضاء المدعوين بالقراءة.",
      },
      BUTTONS: {
        SAVE: "نشر المقال",
        CANCEL: "إلغاء",
        CHANGE_IMAGE: "تغيير الصورة",
        UPLOAD_IMAGE: "رفع صورة",
      },
      ERRORS: {
        PICTURE_REQUIRED: "صورة الغلاف مطلوبة",
        TITLE_REQUIRED: "العنوان مطلوب",
        SUBTITLE_REQUIRED: "العنوان الفرعي مطلوب",
        CATEGORY_REQUIRED: "الفئة مطلوبة",
        BODY_REQUIRED: "المحتوى مطلوب",
        DATE_INVALID: "نطاق التاريخ غير صالح",
        IMAGE_INVALID: "تنسيق الصورة غير صالح",
        SAVE_FAILED: "فشل نشر المقال",
      },
      TOAST: {
        SUCCESS: "تم نشر المقال بنجاح",
        ERROR: "فشل نشر المقال",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "يجب أن يحتوي العنوان على 5 أحرف على الأقل",
        TITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان 200 حرف",
        SUBTITLE_MIN_LENGTH:
          "يجب أن يحتوي العنوان الفرعي على 10 أحرف على الأقل",
        SUBTITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان الفرعي 300 حرف",
        BODY_MIN_LENGTH: "يجب أن يحتوي المحتوى على 50 حرفًا على الأقل",
        IMAGE_TOO_LARGE: "يجب أن يكون حجم الصورة أقل من 5 ميغابايت",
      },
    },

    ARTICLE: {
      TITLE: "مقال جديد",
      DESCRIPTION: "أنشئ خبرًا أو إعلانًا لمجتمعك.",
      LABELS: {
        PICTURE: "صورة الغلاف",
        TITLE: "العنوان",
        CATEGORY: "الفئة",
        DESCRIPTION: "وصف قصير",
        BODY: "المحتوى",
        USERS: "المستخدمون المسموح لهم",
        PRIVATE: "مقال خاص",
      },
      PLACEHOLDERS: {
        PICTURE: "قم برفع صورة غلاف",
        TITLE: "أدخل عنوان المقال…",
        DESCRIPTION: "اكتب وصفًا مختصرًا يظهر في المعاينة…",
        BODY: "اكتب محتوى المقال هنا…",
        USERS: "ابحث عن مستخدمين…",
      },
      HINTS: {
        PRIVATE: "فقط أنت والمستخدمون الذين تختارهم يمكنهم رؤية هذا المقال.",
        USERS: "اتركه فارغًا للسماح لجميع الأعضاء المدعوين بالقراءة.",
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
      },
      BUTTONS: {
        SAVE: "نشر المقال",
        CANCEL: "إلغاء",
        CHANGE_IMAGE: "تغيير الصورة",
        UPLOAD_IMAGE: "رفع صورة",
      },
      ERRORS: {
        PICTURE_REQUIRED: "صورة الغلاف مطلوبة",
        TITLE_REQUIRED: "العنوان مطلوب",
        CATEGORY_REQUIRED: "الفئة مطلوبة",
        DESCRIPTION_REQUIRED: "الوصف مطلوب",
        BODY_REQUIRED: "المحتوى مطلوب",
        IMAGE_INVALID: "تنسيق الصورة غير صالح",
        SAVE_FAILED: "فشل نشر المقال",
      },
      TOAST: {
        SUCCESS: "تم نشر المقال بنجاح",
        ERROR: "فشل نشر المقال",
        UPDATED_SUCCESSFULLY: "تم تحديث المقال بنجاح",
      },
      VALIDATION: {
        TITLE_MIN_LENGTH: "يجب أن يحتوي العنوان على 5 أحرف على الأقل",
        TITLE_MAX_LENGTH: "لا يمكن أن يتجاوز العنوان 200 حرف",
        DESCRIPTION_MIN_LENGTH: "يجب أن يحتوي الوصف على 20 حرفًا على الأقل",
        DESCRIPTION_MAX_LENGTH: "لا يمكن أن يتجاوز الوصف 500 حرف",
        BODY_MIN_LENGTH: "يجب أن يحتوي المحتوى على 50 حرفًا على الأقل",
        IMAGE_TOO_LARGE: "يجب أن يكون حجم الصورة أقل من 5 ميغابايت",
      },
    },

    SURVEY: {
      TITLE: "استطلاع جديد",
      DESCRIPTION: "أنشئ استطلاعًا لجمع الملاحظات أو الآراء.",
      LABELS: {
        TITLE: "العنوان",
        TYPE: "النوع",
        PRIVATE: "استطلاع خاص",
        USERS: "المستخدمون المسموح لهم",
      },
      PLACEHOLDERS: {
        TITLE: "ما موضوع الاستطلاع؟",
        USERS: "ابحث عن مستخدمين…",
      },
      HINTS: {
        PRIVATE: "فقط الأعضاء المدعوون سيتمكنون من رؤية الاستطلاع والرد عليه.",
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
      },
      BUTTONS: {
        SAVE: "إنشاء الاستطلاع",
        CANCEL: "إلغاء",
      },
      ERRORS: {
        TITLE_REQUIRED: "العنوان مطلوب",
        TYPE_REQUIRED: "نوع الاستطلاع مطلوب",
        SAVE_FAILED: "فشل إنشاء الاستطلاع",
      },
      TOAST: {
        SUCCESS: "تم إنشاء الاستطلاع بنجاح",
        ERROR: "فشل إنشاء الاستطلاع",
      },
    },

    CATEGORY: {
      TITLE: "فئة جديدة",
      DESCRIPTION: "أنشئ فئة جديدة لتنظيم المحتوى الخاص بك.",
      LABELS: {
        NAME: "اسم الفئة",
        DESCRIPTION: "الوصف",
      },
      PLACEHOLDERS: {
        NAME: "أدخل اسم الفئة…",
        DESCRIPTION: "صف هذه الفئة…",
      },
      BUTTONS: {
        SAVE: "حفظ الفئة",
        CANCEL: "إلغاء",
      },
      ERRORS: {
        NAME_REQUIRED: "اسم الفئة مطلوب",
        SAVE_FAILED: "فشل حفظ الفئة",
      },
      TOAST: {
        SUCCESS: "تم حفظ الفئة بنجاح",
        ERROR: "فشل حفظ الفئة",
      },
    },

    USER: {
      TITLE: "مستخدم جديد",
      DESCRIPTION: "أنشئ حساب مستخدم جديد وعيّن الأدوار.",
      LABELS: {
        DIRECTION: "الإدارة",
        FIRSTNAME: "الاسم الأول",
        LASTNAME: "اسم العائلة",
        MOBILE: "الهاتف",
        EMAIL: "البريد الإلكتروني",
        PASSWORD: "كلمة المرور",
        CONFIRM_PASSWORD: "تأكيد كلمة المرور",
        ROLES: "الأدوار",
      },
      PLACEHOLDERS: {
        DIRECTION: "أدخل الإدارة…",
        FIRSTNAME: "أدخل الاسم الأول…",
        LASTNAME: "أدخل اسم العائلة…",
        MOBILE: "أدخل رقم الهاتف…",
        EMAIL: "أدخل البريد الإلكتروني…",
        PASSWORD: "أدخل كلمة المرور…",
        CONFIRM_PASSWORD: "أكد كلمة المرور…",
        ROLES: "اختر الأدوار…",
      },
      HINTS: {
        REQUIRED_FIELDS: "الحقول المميزة بـ * مطلوبة",
        PASSWORD_MIN_LENGTH: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
      },
      BUTTONS: {
        SAVE: "إنشاء المستخدم",
        CANCEL: "إلغاء",
      },
      ERRORS: {
        DIRECTION_REQUIRED: "الإدارة مطلوبة",
        FIRST_NAME_REQUIRED: "الاسم الأول مطلوب",
        LAST_NAME_REQUIRED: "اسم العائلة مطلوب",
        MOBILE_REQUIRED: "الهاتف مطلوب",
        EMAIL_REQUIRED: "البريد الإلكتروني مطلوب",
        EMAIL_INVALID: "الرجاء إدخال بريد إلكتروني صالح",
        PASSWORD_REQUIRED: "كلمة المرور مطلوبة",
        PASSWORD_MIN_LENGTH: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
        CONFIRM_PASSWORD_REQUIRED: "تأكيد كلمة المرور مطلوب",
        PASSWORDS_DO_NOT_MATCH: "كلمات المرور غير متطابقة",
        ROLES_REQUIRED: "مطلوب دور واحد على الأقل",
        SAVE_FAILED: "فشل إنشاء المستخدم",
      },
      TOAST: {
        SUCCESS: "تم إنشاء المستخدم بنجاح",
        ERROR: "فشل إنشاء المستخدم",
      },
      VALIDATION: {
        PASSWORD_MIN_LENGTH: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
      },
    },

    SHARED: {
      LABELS: {
        LOADING: "جارٍ التحميل…",
        REQUIRED: "حقل مطلوب",
        OPTIONAL: "اختياري",
        SELECT_PLACEHOLDER: "اختر خيارًا",
        MULTI_SELECT_PLACEHOLDER: "اختر عدة خيارات",
        TAG_PLACEHOLDER: "أضف وسومًا…",
        SEARCH_USERS: "ابحث عن مستخدمين…",
        NO_OPTIONS: "لا توجد خيارات",
        NO_RESULTS: "لا توجد نتائج",
        BASIC_INFO: "معلومات أساسية",
        SETTINGS: "الإعدادات",
      },
      BUTTONS: {
        BROWSE: "استعراض",
        UPLOAD: "رفع",
        REMOVE: "حذف",
        CLEAR: "مسح",
        RESET: "إعادة تعيين",
        CLOSE: "إغلاق",
      },
      ERRORS: {
        NETWORK_ERROR: "خطأ في الشبكة، حاول مرة أخرى",
        VALIDATION_ERROR: "يرجى تصحيح الأخطاء أعلاه",
        UNAUTHORIZED: "ليس لديك صلاحية لتنفيذ هذا الإجراء",
        UNKNOWN_ERROR: "حدث خطأ غير متوقع",
      },
      VALIDATION: {
        MIN_LENGTH: "يجب أن يحتوي على {{min}} حرفًا على الأقل",
        MAX_LENGTH: "لا يمكن أن يتجاوز {{max}} حرفًا",
        PATTERN_INVALID: "تنسيق غير صالح",
        EMAIL_INVALID: "بريد إلكتروني غير صالح",
        URL_INVALID: "رابط غير صالح",
        DATE_INVALID: "تنسيق تاريخ غير صالح",
      },
    },
  },

  EDIT: {
    FORUM: {
      TITLE: "تعديل الموضوع",
      DESCRIPTION: "قم بتحديث الموضوع والإعدادات.",
      BUTTONS: {
        SAVE: "تحديث",
      },
      TOAST: {
        SUCCESS: "تم تحديث الموضوع بنجاح",
        ERROR: "فشل تحديث الموضوع",
      },
    },
    BLOG: {
      TITLE: "تعديل المقال",
      DESCRIPTION: "قم بتحديث المقال والإعدادات.",
      BUTTONS: {
        SAVE: "تحديث",
      },
      TOAST: {
        SUCCESS: "تم تحديث المقال بنجاح",
        ERROR: "فشل تحديث المقال",
      },
    },
    ARTICLE: {
      TITLE: "تعديل المقال",
      DESCRIPTION: "قم بتحديث المقال والإعدادات.",
      BUTTONS: {
        UPDATE: "تحديث",
        SAVE: "تحديث",
      },
      TOAST: {
        SUCCESS: "تم تحديث المقال بنجاح",
        ERROR: "فشل تحديث المقال",
      },
    },

    SURVEY: {
      TITLE: "تعديل الاستطلاع",
      DESCRIPTION: "قم بتحديث إعدادات الاستطلاع والمشاركين.",
      BUTTONS: {
        SAVE: "تحديث الاستطلاع",
      },
      TOAST: {
        SUCCESS: "تم تحديث الاستطلاع بنجاح",
        ERROR: "فشل تحديث الاستطلاع",
      },
    },

    CATEGORY: {
      TITLE: "تعديل الفئة",
      DESCRIPTION: "قم بتحديث اسم الفئة ووصفها.",
      BUTTONS: {
        SAVE: "تحديث الفئة",
      },
      TOAST: {
        SUCCESS: "تم تحديث الفئة بنجاح",
        ERROR: "فشل تحديث الفئة",
      },
    },

    USER: {
      TITLE: "تعديل المستخدم",
      DESCRIPTION: "قم بتحديث معلومات المستخدم والأدوار.",
      BUTTONS: {
        SAVE: "تحديث المستخدم",
      },
      TOAST: {
        SUCCESS: "تم تحديث المستخدم بنجاح",
        ERROR: "فشل تحديث المستخدم",
      },
    },
  },
};
