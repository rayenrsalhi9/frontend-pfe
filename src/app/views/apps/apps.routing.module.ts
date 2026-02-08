import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

const routes: Routes = [
  {
    path: 'mail',
    loadChildren: () => import('./mail/mail.module').then(m => m.MailModule),
    data: {
      title: 'Mail',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    data: {
      title: 'NAV.APPS_CHAT',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarAppModule),
    data: {
      title: 'NAV.APPS_CALENDAR',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'news',
    loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule),
    data: {
      title: 'NAV.APPS_ARTICLE',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'forums',
    loadChildren: () => import('./forum/forum.module').then(m => m.ForumModule),
    data: {
      title: 'NAV.APPS_FORUM',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'blogs',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
    data: {
      title: 'NAV.APPS_BLOG',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'surveys',
    loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule),
    data: {
      title: 'NAV.APPS_SURVEY',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'logins',
    loadChildren: () => import('./login-audit/login-audit.module').then(m => m.LoginAuditModule),
    data: {
      title: 'NAV.APPS_LOGINS',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'responses-audits',
    loadChildren: () => import('./responses-audit/responses-audit.module').then(m => m.ResponsesAuditModule),
    data: {
      title: 'NAV.APPS_RESPONSES_AUDITS',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule { }
