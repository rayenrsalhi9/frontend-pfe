import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@app/core/security/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./blog-list/blog-list.module").then((m) => m.BlogListModule),
    data: {
      title: "NAV.APPS_BLOG_LIST",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
  {
    path: "add",
    loadChildren: () =>
      import("./blog-add/blog-add.module").then((m) => m.BlogAddModule),
    data: {
      title: "BLOG.BUTTONS.ADD",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
  {
    path: "edit/:id",
    loadChildren: () =>
      import("./blog-add/blog-add.module").then((m) => m.BlogAddModule),
    data: {
      title: "BLOG.BUTTONS.EDIT",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
  {
    path: "categories",
    loadChildren: () =>
      import("./blog-category/blog-category.module").then(
        (m) => m.BlogCategoryModule,
      ),
    data: {
      title: "NAV.APPS_BLOG_CATEGORY",
      hidePageHeader: true,
    },
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
