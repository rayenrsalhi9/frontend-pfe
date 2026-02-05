import { NavMenu } from '@app/shared/types/nav-menu.interface';

const dashboard: NavMenu[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    translateKey: 'NAV.DASHBOARD',
    type: 'item',
    iconType: 'feather',
    icon: 'icon-home',
    key: 'dashboard',
    submenu: [],
    claims: ['DASHBOARD_VIEW_DASHBOARD'],
  },
]

const pages: NavMenu[] = [
  {
    path: '',
    title: 'Pages',
    translateKey: 'NAV.PAGES',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-file',
    key: 'pages',
    submenu: [
      {
        path: '',
        title: 'Utility',
        translateKey: 'NAV.PAGES_UTILITY',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-settings',
        key: 'pages.utility',
        submenu: [
          {
            path: '/pages/profile',
            title: 'Profile',
            translateKey: 'NAV.PAGES_UTILITY_PROFILE',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.utility.profile',
            submenu: []
          },
          {
            path: '/pages/invoice',
            title: 'Invoice',
            translateKey: 'NAV.PAGES_UTILITY_INVOICE',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.utility.invoice',
            submenu: []
          },
          {
            path: '/pages/faq',
            title: 'FAQ',
            translateKey: 'NAV.PAGES_UTILITY_FAQ',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.utility.faq',
            submenu: []
          },
          {
            path: '/pages/pricing',
            title: 'FAQ',
            translateKey: 'NAV.PAGES_UTILITY_PRICING',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.utility.pricing',
            submenu: []
          },
          {
            path: '/pages/user-list',
            title: 'User List',
            translateKey: 'NAV.PAGES_UTILITY_USERLIST',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.utility.user-list',
            submenu: []
          }
        ]
      },
      {
        path: '',
        title: 'Auth',
        translateKey: 'NAV.PAGES_AUTH',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-lock',
        key: 'pages.auth',
        submenu: [
          {
            path: '/login',
            title: 'Login',
            translateKey: 'NAV.PAGES_AUTH_LOGIN',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.auth.login',
            submenu: []
          },
          {
            path: '/login/v2',
            title: 'Login v2',
            translateKey: 'NAV.PAGES_AUTH_LOGIN_V2',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.auth.loginv2',
            submenu: []
          },
          {
            path: '/login/v3',
            title: 'Login v3',
            translateKey: 'NAV.PAGES_AUTH_LOGIN_V3',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.auth.loginv3',
            submenu: []
          },
          {
            path: '/register',
            title: 'Register',
            translateKey: 'NAV.PAGES_AUTH_REGISTER',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.auth.register',
            submenu: []
          },
          {
            path: '/register/v2',
            title: 'Register v2',
            translateKey: 'NAV.PAGES_AUTH_REGISTER_V2',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.auth.registerv2',
            submenu: []
          },
          {
            path: '/register/v3',
            title: 'Register v3',
            translateKey: 'NAV.PAGES_AUTH_REGISTER_V3',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.auth.registerv3',
            submenu: []
          },
        ]
      },
      {
        path: '',
        title: 'Errors',
        translateKey: 'NAV.PAGES_ERRORS',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-slash',
        key: 'pages.errors',
        submenu: [
          {
            path: '/error-1',
            title: 'Error 1',
            translateKey: 'NAV.PAGES_ERRORS_ERROR1',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.errors.error1',
            submenu: []
          },
          {
            path: '/error-2',
            title: 'Error 2',
            translateKey: 'NAV.PAGES_ERRORS_ERROR2',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'pages.errors.error2',
            submenu: []
          }
        ]
      }
    ]
  }
]

const charts: NavMenu[] = [
  {
    path: '/charts/apex-chart',
    title: 'Chart',
    translateKey: 'NAV.CHART',
    type: 'item',
    iconType: 'feather',
    icon: 'icon-bar-chart',
    key: 'chart',
    submenu: [
    ]
  }
]

const components: NavMenu[] = [
  {
    path: '',
    title: 'Components',
    translateKey: 'NAV.COMPONENTS',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-package',
    key: 'components',
    claims: ['show'],
    submenu: [
      {
        path: '',
        title: 'UI Elements',
        translateKey: 'NAV.COMPONENTS_UIELEMENTS',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-box',
        key: 'components.ui-elements',
        claims: ['show'],
        submenu: [
          {
            path: '/ui-elements/accordion',
            title: 'Accordion',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_ACCORDION',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.accordion',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/alert',
            title: 'Alert',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_ALERT',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.alert',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/buttons',
            title: 'Buttons',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_BUTTONS',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.buttons',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/carousel',
            title: 'Carousel',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_CAROUSEL',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.carousel',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/collapse',
            title: 'Collapse',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_COLLAPSE',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.collapse',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/datepicker',
            title: 'Datepicker',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_DATEPICKER',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.datepicker',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/dropdown',
            title: 'Dropdown',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_DROPDOWN',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.dropdown',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/modal',
            title: 'Modal',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_MODAL',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.modal',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/pagination',
            title: 'Pagination',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_PAGINATION',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.pagination',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/popover',
            title: 'Popover',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_POPOVER',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.popover',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/progressbar',
            title: 'Progressbar',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_PROGRESSBAR',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.progressbar',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/rating',
            title: 'Rating',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_RATING',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.rating',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/sortable',
            title: 'Sortable',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_SORTABLE',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.sortable',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/tabs',
            title: 'Tabs',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_TABS',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.tabs',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/timepicker',
            title: 'Timepicker',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_TIMEPICKER',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.timepicker',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/tooltip',
            title: 'Tooltip',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_TOOLTIP',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.tooltip',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/ui-elements/typehead',
            title: 'Typehead',
            translateKey: 'NAV.COMPONENTS_UIELEMENTS_TYPEHEAD',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.ui-elements.typehead',
            submenu: [],
            claims: ['show'],
          },
        ],
      },
      {
        path: '',
        title: 'Form Elements',
        translateKey: 'NAV.COMPONENTS_FORMELEMENTS',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-file-text',
        key: 'formElements',
        claims: ['show'],
        submenu: [
          {
            path: '/form-elements/input',
            title: 'Input',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_INPUT',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.input',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/form-elements/radio',
            title: 'Radio',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_RADIO',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.radio',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/form-elements/checkbox',
            title: 'Checkbox',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_CHECKBOX',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.checkbox',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/form-elements/switch',
            title: 'Switch',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_SWITCH',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.switch',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/form-elements/select',
            title: 'Select',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_SELECT',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.select',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/form-elements/upload',
            title: 'Upload',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_UPLOAD',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.upload',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/form-elements/form',
            title: 'Form',
            translateKey: 'NAV.COMPONENTS_FORMELEMENTS_FORM',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.formElements.form',
            submenu: [],
            claims: ['show'],
          },
        ]
      },
      {
        path: '',
        title: 'Tables',
        translateKey: 'NAV.COMPONENTS_TABLES',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-grid',
        key: 'components.tables',
        claims: ['show'],
        submenu: [
          {
            path: '/tables/table',
            title: 'Table',
            translateKey: 'NAV.COMPONENTS_TABLES_TABLE',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.tables.table',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/tables/data-table',
            title: 'Data Table',
            translateKey: 'NAV.COMPONENTS_TABLES_DATATABLE',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.tables.dataTable',
            submenu: [],
            claims: ['show'],
          }
        ]
      },
      {
        path: '',
        title: 'Icons',
        translateKey: 'NAV.COMPONENTS_ICONS',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-star',
        key: 'components.icons',
        claims: ['show'],
        submenu: [
          {
            path: '/icons/feather',
            title: 'Feather',
            translateKey: 'NAV.COMPONENTS_ICONS_FEATHER',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.icons.feather',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/icons/line-awesome',
            title: 'Feather',
            translateKey: 'NAV.COMPONENTS_ICONS_LINE_AWESOME',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.icons.line-awesome',
            submenu: [],
            claims: ['show'],
          }
        ]
      },
      {
        path: '',
        title: 'Maps',
        translateKey: 'NAV.COMPONENTS_MAPS',
        type: 'collapse',
        iconType: 'feather',
        icon: 'icon-map',
        key: 'components.maps',
        claims: ['show'],
        submenu: [
          {
            path: '/maps/ammap',
            title: 'Feather',
            translateKey: 'NAV.COMPONENTS_MAPS_AMMAP',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.maps.ammap',
            submenu: [],
            claims: ['show'],
          },
          {
            path: '/maps/google-map',
            title: 'Feather',
            translateKey: 'NAV.COMPONENTS_MAPS_GOOGLE_MAP',
            type: 'item',
            iconType: '',
            icon: '',
            key: 'components.maps.googleMap',
            submenu: [],
            claims: ['show'],
          },
        ]
      }
    ]
  }
]

const apps: NavMenu[] = [
  {
    path: '',
    title: 'Apps',
    translateKey: 'NAV.APPS',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-grid',
    key: 'apps',
    claims: ['REMINDER_VIEW_REMINDERS','ARTICLE_VIEW_ARTICLES','CHAT_VIEW_CHATS','LOGIN_AUDIT_VIEW_LOGIN_AUDIT_LOGS'],
    submenu: [
      /* {
          path: '/apps/mail',
          title: 'Mail',
          translateKey: 'NAV.APPS_MAIL',
          type: 'item',
          iconType: 'feather',
          icon: 'icon-mail',
          key: 'apps.mail',
          submenu: []
      }, */
      {
        path: '/apps/chat',
        title: 'Chat',
        translateKey: 'NAV.APPS_CHAT',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-message-circle',
        key: 'apps.chat',
        claims: ['CHAT_VIEW_CHATS'],
        submenu: []
      },
      {
        path: '/apps/calendar',
        title: 'Calendar',
        translateKey: 'NAV.APPS_CALENDAR',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'apps.calendar',
        claims: ['REMINDER_VIEW_REMINDERS'],
        submenu: []
      },
      {
        path: '/apps/logins',
        title: 'Calendar',
        translateKey: 'NAV.APPS_LOGINS',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-log-in',
        key: 'apps.login',
        claims: ['LOGIN_AUDIT_VIEW_LOGIN_AUDIT_LOGS'],
        submenu: []
      },
      {
        path: '',
        title: 'News',
        translateKey: 'NAV.APPS_ARTICLE',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la-newspaper',
        key: 'apps.news',
        claims: ['ARTICLE_VIEW_ARTICLES','ARTICLE_VIEW_CATEGORIES'],
        submenu: [
          {
            path: '/apps/news',
            title: 'List',
            translateKey: 'NAV.APPS_ARTICLE_LIST',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.news.list',
            claims: ['ARTICLE_VIEW_ARTICLES'],
            submenu: [],
          },
          {
            path: '/apps/news/categories',
            title: 'Categories',
            translateKey: 'NAV.APPS_ARTICLE_CATEGORY',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.news.category',
            claims: ['ARTICLE_VIEW_CATEGORIES'],
            submenu: [],
          },
        ]
      },
      {
        path: '',
        title: 'Blogs',
        translateKey: 'NAV.APPS_BLOG',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-bold',
        key: 'apps.blogs',
        claims: ['show'],
        submenu: [
          {
            path: '/apps/blogs',
            title: 'List',
            translateKey: 'NAV.APPS_BLOG_LIST',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.blogs.list',
            claims: ['show'],
            submenu: [],
          },
          {
            path: '/apps/blogs/categories',
            title: 'Categories',
            translateKey: 'NAV.APPS_BLOG_CATEGORY',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.blogs.categories',
            claims: ['show'],
            submenu: [],
          },
        ],
      },
      {
        path: '',
        title: 'Forums',
        translateKey: 'NAV.APPS_FORUM',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-feather',
        key: 'apps.forums',
        claims: ['show'],
        submenu: [
          {
            path: '/apps/forums',
            title: 'List',
            translateKey: 'NAV.APPS_FORUM_LIST',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.forums.list',
            claims: ['show'],
            submenu: [],
          },
          {
            path: '/apps/forums/categories',
            title: 'Categories',
            translateKey: 'NAV.APPS_FORUM_CATEGORY',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.forums.categories',
            claims: ['show'],
            submenu: [],
          },
        ],
      },
      {
        path: '/apps/surveys',
        title: 'Surveys',
        translateKey: 'NAV.APPS_SURVEY',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-star',
        key: 'apps.surveys.list',
        claims: ['show'],
        submenu: [],
      },

      /* {
        path: '',
        title: 'Blogs',
        translateKey: 'NAV.APPS_BLOG',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la-newspaper',
        key: 'apps.blogs',
        claims: ['show'],
        submenu: [
          {
            path: '/apps/blogs',
            title: 'List',
            translateKey: 'NAV.APPS_BLOG_LIST',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.blogs.list',
            claims: ['show'],
            submenu: [],
          },
        ]
      }, */
      /* {
        path: '',
        title: 'Forums',
        translateKey: 'NAV.APPS_FORUM',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la-newspaper',
        key: 'apps.forums',
        claims: ['show'],
        submenu: [
          {
            path: '/apps/forums',
            title: 'List',
            translateKey: 'NAV.APPS_FORUM_LIST',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.forums.list',
            claims: ['show'],
            submenu: [],
          },
        ]
      }, */
      /* {
        path: '',
        title: 'Survey',
        translateKey: 'NAV.APPS_SURVEY',
        type: 'item',
        iconType: 'line-awesome',
        icon: 'la-newspaper',
        key: 'apps.surveys',
        claims: ['show'],
        submenu: [
          {
            path: '/apps/surveys',
            title: 'List',
            translateKey: 'NAV.APPS_SURVEY_LIST',
            type: 'item',
            iconType: 'line-awesome',
            icon: 'la-newspaper',
            key: 'apps.surveys.list',
            claims: ['show'],
            submenu: [],
          },
        ]
      }, */
      /* {
        path: '/apps/documents',
        title: 'Documents',
        translateKey: 'NAV.APPS_DOCUMENT',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'apps.documents',
        submenu: []
      },
      {
        path: '/apps/documents',
        title: 'Assigned documents',
        translateKey: 'NAV.APPS_DOCUMENT_ASSIGNED',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'apps.assigned-documents',
        submenu: []
      },
      {
        path: '/apps/documents',
        title: 'Document categories',
        translateKey: 'NAV.APPS_DOCUMENT_CATEGORIES',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'apps.documents-categories',
        submenu: []
      },
      {
        path: '/apps/documents',
        title: 'Document audit trails',
        translateKey: 'NAV.APPS_DOCUMENT_AUDIT_TRAIL',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'apps.documents-audit',
        submenu: []
      }, */
    ]
  }
]

const documents: NavMenu[] = [
  {
    path: 'document',
    title: 'Documents',
    translateKey: 'NAV.DOCUMENT',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-grid',
    key: 'documents',
    claims: ["ALL_DOCUMENTS_VIEW_DOCUMENTS", "show"],
    submenu: [
      {
        path: '/document/list',
        title: 'Documents',
        translateKey: 'NAV.DOCUMENT_ALL',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-file',
        key: 'documents.all',
        claims: ['ALL_DOCUMENTS_VIEW_DOCUMENTS'],
        submenu: []
      },
      {
        path: '/document/assigned',
        title: 'Assigned documents',
        translateKey: 'NAV.DOCUMENT_ASSIGNED',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-file-text',
        key: 'documents.assigned-documents',
        claims: ['show'],
        submenu: []
      },
      {
        path: '/document/categories',
        title: 'Document categories',
        translateKey: 'NAV.DOCUMENT_CATEGORIES',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-folder',
        key: 'documents.documents-categories',
        claims: ['DOCUMENT_CATEGORY_MANAGE_DOCUMENT_CATEGORY'],
        submenu: []
      },
      {
        path: '/document/audit',
        title: 'Document audit trails',
        translateKey: 'NAV.DOCUMENT_AUDIT_TRAIL',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-calendar',
        key: 'documents.documents-audit',
        claims: ['DOCUMENT_AUDIT_TRAIL_VIEW_DOCUMENT_AUDIT_TRAIL'],
        submenu: []
      },
    ]
  }
]

const users: NavMenu[] = [
  {
    path: 'user',
    title: 'Users',
    translateKey: 'NAV.USERS',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-grid',
    key: 'users',
    claims: ['USER_VIEW_USERS', 'ROLE_VIEW_ROLES', 'USER_ASSIGN_USER_ROLE'],
    submenu: [
      {
        path: '/user/list',
        title: 'Users',
        translateKey: 'NAV.USERS_LIST',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-users',
        key: 'users.list',
        claims: ['USER_VIEW_USERS'],
        submenu: []
      },
      {
        path: '/user/role',
        title: 'Roles',
        translateKey: 'NAV.USERS_ROLES_LIST',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-shield',
        key: 'users.roles',
        claims: ['ROLE_VIEW_ROLES'],
        submenu: []
      },
      {
        path: '/user/role-user',
        title: 'User Role',
        translateKey: 'NAV.USERS_ROLES',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-user-check',
        key: 'users.role-user',
        claims: ['USER_ASSIGN_USER_ROLE'],
        submenu: []
      }
    ]
  }
]

const others: NavMenu[] = [
  {
    path: '',
    title: 'Others',
    translateKey: 'NAV.OTHERS',
    type: 'title',
    iconType: 'feather',
    icon: 'icon-file',
    key: 'others',
    submenu: [
      {
        path: '/docs/getting-started',
        title: 'Documentation',
        translateKey: 'NAV.OTHERS_DOCUMENTATION',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-file',
        key: 'others.documentation',
        submenu: []
      },
      {
        path: '/docs/changelog',
        title: 'Changelog',
        translateKey: 'NAV.OTHERS_CHANGELOG',
        type: 'item',
        iconType: 'feather',
        icon: 'icon-edit',
        key: 'others.changelog',
        submenu: []
      }
    ]
  }
]

export const navConfiguration: NavMenu[] = [
  ...dashboard,
  ...documents,
  ...apps,
  ...users,
  //...components,
  //...charts,
  //...pages,
  //...others
]
