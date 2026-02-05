import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/security/auth.guard';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
    data: {
      title: 'NAV.USERS_LIST',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'user-add',
    loadChildren: () => import('./user-add/user-add.module').then(m => m.UserAddModule),
    data: {
      title: 'USERS.LIST.BUTTONS.ADD',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'user-edit/:id',
    loadChildren: () => import('./user-edit/user-edit.module').then(m => m.UserEditModule),
    data: {
      title: 'USERS.LIST.BUTTONS.EDIT',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'role',
    loadChildren: () => import('./role-list/role-list.module').then(m => m.RoleListModule),
    data: {
      title: 'NAV.USERS_ROLES_LIST',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'role-add',
    loadChildren: () => import('./role-add/role-add.module').then(m => m.RoleAddModule),
    data: {
      title: 'ROLES.LIST.BUTTONS.ADD',
      hidePageHeader: false,
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'role-edit/:id',
    loadChildren: () => import('./role-add/role-add.module').then(m => m.RoleAddModule),
    data: {
      title: 'ROLES.LIST.BUTTONS.EDIT',
      hidePageHeader: false,
    },
    canLoad: [AuthGuard],
  },
  {
    path: 'role-user',
    loadChildren: () => import('./role-user/role-user.module').then(m => m.RoleUserModule),
    data: {
      title: 'NAV.USERS_ROLES',
      hidePageHeader: false
    },
    canLoad: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
