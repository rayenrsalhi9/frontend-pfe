import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { AppLayoutComponent } from "./layout/app-layout/app-layout-component";

import { AUTH_LAYOUT_ROUTES } from "./routes/auth-layout.routes";
import { APP_LAYOUT_ROUTES } from './routes/app-layout.routes';
import { AuthGuard } from './core/security/auth.guard';
import { WelcomeLayoutComponent } from './layout/welcome-layout/welcome-layout.component';


const appRoutes: Routes = [
  /* {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }, */
  //welcome
  {
    path:'',
    component: WelcomeLayoutComponent,
    children:[
      {
        path:'',
        loadChildren: ()=> import('./views/front/welcome/welcome.module').then(m=>m.WelcomeModule)
      },
      {
        path:'blog',
        loadChildren: ()=> import('./views/front/blog/blog.module').then(m=>m.BlogModule)
      },
      {
        path:'forum',
        loadChildren: ()=> import('./views/front/forum/forum.module').then(m=>m.ForumModule)
      },
   
    ]
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: APP_LAYOUT_ROUTES
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: AUTH_LAYOUT_ROUTES
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
