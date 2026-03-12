export const users = {
  USERS: {
    LIST: {
      TABLE: {
        EMAIL: "البريد الإلكتروني",
        FIRSTNAME: "الاسم الأول",
        LASTNAME: "اسم العائلة",
        MOBILE: "رقم الهاتف المحمول",
        PHONE: "رقم الهاتف",
        ACTION: "الإجراءات",
      },
      BUTTONS: {
        ADD: "إضافة مستخدم",
        EDIT: "تعديل",
        DELETE: "حذف",
        RESETPASSWORD: "إعادة تعيين كلمة المرور",
      },
    },

    ADD: {
      LABELS: {
        FIRSTNAME: "الاسم الأول",
        LASTNAME: "اسم العائلة",
        MOBILE: "رقم الهاتف المحمول",
        EMAIL: "البريد الإلكتروني",
        PASSWORD: "كلمة المرور",
        CONFPASSWORD: "تأكيد كلمة المرور",
        ROLES: "أدوار المستخدم",
        MATRICULE: "المعرّف الوظيفي",
        DIRECTION: "القسم",
      },

      BUTTONS: {
        ADD: "حفظ",
        CANCEL: "إلغاء",
      },

      ERRORS: {
        FIRST_NAME_IS_REQUIRED: "الاسم الأول مطلوب",
        LAST_NAME_IS_REQUIRED: "اسم العائلة مطلوب",
        MOBILE_IS_REQUIRED: "رقم الهاتف المحمول مطلوب",
        EMAIL_IS_REQUIRED: "البريد الإلكتروني مطلوب",
        PLEASE_ENTER_VALID_EMAIL: "يرجى إدخال بريد إلكتروني صالح",
        PASSWORD_IS_REQUIRED: "كلمة المرور مطلوبة",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
        CONFIRM_PASSWORD_IS_REQUIRED: "تأكيد كلمة المرور مطلوب",
        PASSWORDS_DO_NOT_MATCH: "كلمتا المرور غير متطابقتين",
        DIRECTION_IS_REQUIRED: "القسم مطلوب",
        MATRICULE_IS_REQUIRED: "المعرّف الوظيفي مطلوب",
      },

      TOAST: {
        ADDED_SUCCESS: "تم إنشاء المستخدم بنجاح",
        USER_UPDATED_SUCCESSFULLY: "تم تحديث بيانات المستخدم بنجاح",
        ADDED_ERROR: "حدث خطأ أثناء إنشاء المستخدم",
        PLEASE_ENTER_PROPER_DATA: "يرجى إدخال بيانات صحيحة وكاملة",
      },
    },

    PASSWORD: {
      LABELS: {
        TITLE: "كلمة مرور المستخدم",
        EMAIL: "البريد الإلكتروني",
        PASSWORD: "كلمة المرور الجديدة",
        CONFPASSWORD: "تأكيد كلمة المرور",
      },

      BUTTONS: {
        SAVE: "حفظ",
        CANCEL: "إلغاء",
      },

      ERRORS: {
        EMAIL_IS_REQUIRED: "البريد الإلكتروني مطلوب",
        PLEASE_ENTER_VALID_EMAIL: "يرجى إدخال بريد إلكتروني صالح",
        PASSWORD_IS_REQUIRED: "كلمة المرور مطلوبة",
        YOU_HAVE_TO_ENTER_AT_LEAST_DIGIT:
          "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
        CONFIRM_PASSWORD_IS_REQUIRED: "تأكيد كلمة المرور مطلوب",
        PASSWORDS_DO_NOT_MATCH: "كلمتا المرور غير متطابقتين",
      },

      TOAST: {
        SUCCESSFULLY_CHANGED_PASSWORD: "تم تغيير كلمة المرور بنجاح",
      },
    },

    DELETE: {
      LABEL: {
        title: "حذف المستخدم",
        message: "هل أنت متأكد من رغبتك في حذف حساب هذا المستخدم بشكل نهائي؟",
        button: {
          cancel: "إلغاء",
          confirm: "تأكيد",
        },
      },

      ERROR: {},

      TOAST: {
        USER_DELETED_SUCCESSFULLY: "تم حذف المستخدم بنجاح",
      },
    },
  },
};
