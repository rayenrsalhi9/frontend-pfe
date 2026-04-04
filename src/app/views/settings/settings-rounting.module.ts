import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@app/core/security/auth.guard";

const DEFAULT_ROUTE_DATA = { hidePageHeader: true };

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./smtp-list/smtp-list.module").then((m) => m.SmtpListModule),
    data: {
      ...DEFAULT_ROUTE_DATA,
      title: "SMTP list",
    },
    canLoad: [AuthGuard],
  },
  {
    path: "add",
    loadChildren: () =>
      import("./smtp-add/smtp-add.module").then((m) => m.SmtpAddModule),
    data: {
      ...DEFAULT_ROUTE_DATA,
      title: "SMTP add",
    },
    canLoad: [AuthGuard],
  },
  {
    path: "edit/:id",
    loadChildren: () =>
      import("./smtp-add/smtp-add.module").then((m) => m.SmtpAddModule),
    data: {
      ...DEFAULT_ROUTE_DATA,
      title: "SMTP update",
    },
    canLoad: [AuthGuard],
  },
  {
    path: "company",
    loadChildren: () =>
      import("./company-profile/company-profile.module").then(
        (m) => m.CompanyProfileModule,
      ),
    data: {
      ...DEFAULT_ROUTE_DATA,
      title: "Company profile",
    },
    canLoad: [AuthGuard],
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
    data: {
      ...DEFAULT_ROUTE_DATA,
      title: "Profile",
    },
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
