export const documents = {
  DOCUMENTS: {
    LIST: {
      TITLE: "المستندات",
      DESCRIPTION:
        "قم بإدارة وتنظيم والوصول إلى جميع مستندات الشركة بأمان من مكان واحد.",
      BUTTONS: {
        ADD: "إضافة مستند",
        VIEW: "عرض",
        EDIT: "تعديل",
        DOWNLOAD: "تنزيل",
        UPLOAD: "رفع نسخة جديدة",
        HISTORY: "سجل الإصدارات",
        COMMENT: "تعليق",
        REMINDER: "تذكير",
        EMAIL: "إرسال بريد إلكتروني",
        DELETE: "حذف",
      },
      TABLE: {
        NAME: "اسم المستند",
        CATEGORY: "الفئة",
        CREATED: "تاريخ الإنشاء",
        CREATOR: "تم الإنشاء بواسطة",
        UPDATED: "تاريخ التحديث",
        ACTIONS: "الإجراءات",
      },
      LABELS: {
        SEARCH: "البحث باسم المستند",
        TAGS: "التصفية حسب العلامات",
        CATEGORY: "التصفية حسب الفئة",
        DATE: "التصفية حسب التاريخ",
      },
      EMPTY_STATE: {
        TITLE: "لم يتم العثور على مستندات",
        DESCRIPTION: "لا توجد مستندات تطابق عوامل التصفية المحددة.",
      },
    },

    ASSIGNED: {
      TITLE: "المستندات المعيّنة",
      DESCRIPTION:
        "اعرض وأدر المستندات التي تمت مشاركتها معك أو تعيينها إلى دورك.",
      BUTTONS: {
        ADD: "إضافة مستند",
        VIEW: "عرض",
        EDIT: "تعديل",
        DOWNLOAD: "تنزيل",
        UPLOAD: "رفع نسخة جديدة",
        HISTORY: "سجل الإصدارات",
        COMMENT: "تعليق",
        REMINDER: "تذكير",
        EMAIL: "إرسال بريد إلكتروني",
        DELETE: "حذف",
      },
      TABLE: {
        NAME: "اسم المستند",
        CATEGORY: "الفئة",
        CREATED: "تاريخ الإنشاء",
        CREATOR: "تم الإنشاء بواسطة",
        UPDATED: "تاريخ التحديث",
        EXPIRE: "تاريخ الانتهاء",
        ACTIONS: "الإجراءات",
      },
      LABELS: {
        SEARCH: "البحث باسم المستند",
        TAGS: "التصفية حسب العلامات",
        CATEGORY: "التصفية حسب الفئة",
        DATE: "التصفية حسب التاريخ",
      },
      EMPTY_STATE: {
        TITLE: "لم يتم العثور على مستندات معيّنة",
        DESCRIPTION: "لا توجد مستندات معيّنة تطابق عوامل التصفية المحددة.",
      },
    },

    ADD: {
      LABEL: {
        DOCUMENT_UPLOAD: "رفع مستند",
        DOCUMENT_NAME: "اسم المستند",
        DOCUMENT_CATEGORY: "الفئة",
        DOCUMENT_DESCRIPTION: "الوصف",
        DOCUMENT_TAGS: "العلامات",
        DOCUMENT_ROLE_ASSIGN: "تعيين/مشاركة مع الأدوار",
        DOCUMENT_USER_ASSIGN: "تعيين/مشاركة مع المستخدمين",
        DOCUMENT_PERIODE: "تحديد الفترة",
        DOCUMENT_PERIODE_SD: "تاريخ البداية",
        DOCUMENT_PERIODE_ED: "تاريخ النهاية",
        DOCUMENT_DOWNLOAD: "السماح بالتنزيل",
        DOCUMENT_SAVE: "حفظ",
        DOCUMENT_CANCEL: "إلغاء",
      },
      ERROR: {
        DOCUMENT_IS_REQUIRED: "المستند مطلوب.",
        DOCUMENT_TYPE_IS_NOT_ALLOW: "نوع الملف غير مسموح به.",
        NAME_IS_REQUIRED: "اسم المستند مطلوب.",
        CATEGORY_IS_REQUIRED: "الفئة مطلوبة.",
        START_DATE_IS_REQURED: "تاريخ البداية مطلوب.",
        END_DATE_IS_REQURED: "تاريخ النهاية مطلوب.",
      },
      TOAST: {
        DOCUMENT_SAVE_SUCCESSFULLY: "تم حفظ المستند بنجاح.",
      },
    },

    EDIT: {
      LABEL: {
        DOCUMENT_EDIT: "تعديل المستند",
        DOCUMENT_NAME: "اسم المستند",
        DOCUMENT_CATEGORY: "الفئة",
        DOCUMENT_DESCRIPTION: "الوصف",
        DOCUMENT_TAGS: "العلامات",
        DOCUMENT_SAVE: "حفظ",
        DOCUMENT_CANCEL: "إلغاء",
      },
      ERROR: {
        NAME_IS_REQUIRED: "اسم المستند مطلوب.",
        CATEGORY_IS_REQUIRED: "الفئة مطلوبة.",
      },
      TOAST: {
        DOCUMENT_UPDATE_SUCCESSFULLY: "تم تحديث المستند بنجاح.",
      },
    },

    UPLOAD: {
      LABEL: {
        DOCUMENT_NEW_VERSION: "رفع نسخة جديدة",
        DOCUMENT_UPLOAD: "رفع المستند",
        DOCUMENT_SAVE: "حفظ",
        DOCUMENT_CANCEL: "إلغاء",
      },
      ERROR: {
        DOCUMENT_TYPE_IS_NOT_ALLOW: "نوع الملف غير مسموح به.",
      },
      TOAST: {
        DOCUMENT_SAVE_SUCCESSFULLY: "تم رفع المستند بنجاح.",
      },
    },

    DOWNLOAD: {
      TOAST: {
        ERROR_WHILE_DOWNLOADING_DOCUMENT: "حدث خطأ أثناء تنزيل المستند.",
      },
    },

    HISTORY: {
      LABEL: {
        DOCUMENT_VERSION_HISTORY: "سجل الإصدارات",
        DOCUMENT_ADDED_BY: "تمت الإضافة بواسطة",
        DOCUMENT_CURRENT_VERSION: "الإصدار الحالي",
        DOCUMENT_VISIBILITY: "إمكانية الوصول",
        DOCUMENT_DOWNLOAD: "تنزيل",
        DOCUMENT_RESTORE: "استعادة",
      },
      ERROR: {},
      TOAST: {
        VERSION_RESTORED_SUCCESSFULLY: "تمت استعادة الإصدار بنجاح.",
        ERROR_WHILE_DOWNLOADING_DOCUMENT: "حدث خطأ أثناء تنزيل المستند.",
      },
    },

    COMMENT: {
      LABEL: {
        DOCUMENT_COMMENT_TITLE: "تعليقات المستند",
        DOCUMENT_COMMENT: "تعليق",
        DOCUMENT_ADD_COMMENT: "إضافة تعليق",
        DOCUMENT_CLOSE: "إغلاق",
      },
      ERROR: {
        COMMENT_IS_REQUIRED: "التعليق مطلوب.",
      },
      TOAST: {},
    },

    REMINDER: {
      LABEL: {
        DOCUMENT_REMINDER_TITLE: "تذكير المستند",
        DOCUMENT_REMINDER_SUBJECT: "الموضوع",
        DOCUMENT_REMINDER_MESSAGE: "الرسالة",
        DOCUMENT_REMINDER_REPEAT: "تكرار التذكير",
        DOCUMENT_REMINDER_SEND_EMAIL: "إرسال بريد إلكتروني",
        DOCUMENT_REMINDER_USERS: "اختر المستخدمين",
        DOCUMENT_REMINDER_FREQUENCY: "التكرار",
        DOCUMENT_REMINDER_WEEKDAYS: "أيام الأسبوع",
        DOCUMENT_REMINDER_DATE: "تاريخ التذكير",
        DOCUMENT_REMINDER_START_DATE: "تاريخ البداية",
        DOCUMENT_REMINDER_END_DATE: "تاريخ النهاية",
        DOCUMENT_REMINDER_SAVE: "حفظ",
        DOCUMENT_REMINDER_CANCEL: "إلغاء",
        SELECT_QUARTER_DATE: "اختر تاريخ الربع",
        SELECT_REMINDER_MONTH: "اختر شهر التذكير",
        SELECT_REMINDER_DAY: "اختر يوم التذكير",
        SELECT_DATE: "اختر التاريخ",
      },
      ERROR: {
        SUBJECT_IS_REQUIRED: "الموضوع مطلوب.",
        MESSAGE_IS_REQUIRED: "الرسالة مطلوبة.",
        FREQUENCY_IS_REQUIRED: "التكرار مطلوب.",
        PLEASE_SELECT_VALID_DAY: "يرجى اختيار يوم صالح.",
        DATE_IS_REQUIRED: "تاريخ التذكير مطلوب.",
        START_DATE_SHOULD_BE_GREATER_THEN_CURRENT_DATE_TIME:
          "يجب أن يكون تاريخ البداية بعد التاريخ والوقت الحاليين.",
        START_DATE_IS_REQUIRED: "تاريخ البداية مطلوب.",
      },
      TOAST: {
        REMINDER_CREATED_SUCCESSFULLY: "تم إنشاء التذكير بنجاح.",
        REMINDER_UPDATED_SUCCESSFULLY: "تم تحديث التذكير بنجاح.",
      },
    },

    EMAIL: {
      LABEL: {
        DOCUMENT_EMAIL_TITLE: "إرسال بريد إلكتروني",
        DOCUMENT_EMAIL_TO: "إلى",
        DOCUMENT_EMAIL_SUBJECT: "الموضوع",
        DOCUMENT_EMAIL_BODY: "الرسالة",
        DOCUMENT_EMAIL_ATTACHMENT_DOCUMENT: "إرفاق المستند",
        DOCUMENT_EMAIL_SEND: "إرسال",
      },
      ERROR: {
        TO_ADDRESS_IS_REQUIRED: "عنوان بريد المستلم مطلوب.",
        EMAIL_IS_NOT_PROPER_FORMAT: "يرجى إدخال عنوان بريد إلكتروني صالح.",
        SUBJECT_IS_REQUIRED: "الموضوع مطلوب.",
        BODY_IS_REQUIRED: "محتوى الرسالة مطلوب.",
      },
      TOAST: {
        EMAIL_SENT_SUCCESSFULLY: "تم إرسال البريد الإلكتروني بنجاح.",
      },
    },

    DELETE: {
      LABEL: {
        TITLE: "هل أنت متأكد؟",
        MESSAGE: "هل أنت متأكد أنك تريد حذف هذا المستند؟",
        BUTTON: {
          CANCEL: "إلغاء",
          CONFIRM: "تأكيد",
        },
      },
      ERROR: {},
      TOAST: {
        DOCUMENT_DELETED_SUCCESSFULLY: "تم حذف المستند بنجاح.",
      },
    },

    SHARE: {
      LABEL: {
        DOCUMENT_SHARE: "مشاركة المستند",
        DOCUMENT_NAME: "اسم المستند",
        DESCRIPTION: "الوصف",
      },
      ERROR: {},
      TOAST: {
        PERMISSION_DELETED_SUCCESSFULLY: "تم حذف الصلاحية بنجاح.",
      },
    },
  },
};
