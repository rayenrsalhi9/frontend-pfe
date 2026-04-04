import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@app/core/security/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./smtp-list/smtp-list.module").then((m) => m.SmtpListModule),
    data: {
      title: "SMTP list",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
  {
    path: "add",
    loadChildren: () =>
      import("./smtp-add/smtp-add.module").then((m) => m.SmtpAddModule),
    data: {
      title: "SMTP add",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
  {
    path: "edit/:id",
    loadChildren: () =>
      import("./smtp-add/smtp-add.module").then((m) => m.SmtpAddModule),
    data: {
      title: "SMTP update",
      hidePageHeader: true,
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
      title: "Company profile",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
    data: {
      title: "Profile",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
