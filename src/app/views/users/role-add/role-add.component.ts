import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@app/shared/enums/page";
import { Role } from "@app/shared/enums/role";
import { User } from "@app/shared/enums/user-auth";
import { RoleService } from "@app/shared/services/role.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-role-add",
  templateUrl: "./role-add.component.html",
  styleUrls: ["./role-add.component.scss"],
})
export class RoleAddComponent implements OnInit, OnDestroy {
  pagesList: any[];
  actionsList: any[];
  pages: Page[];
  roleName: any;
  role: Role = null;
  user: any;
  @Output() manageUserClaimAction: EventEmitter<User> =
    new EventEmitter<User>();
  step = 0;
  allSelected = false;
  isLoading = false;
  isEditMode = false;
  private destroy$ = new Subject<void>();

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initData() {
    this.activeRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (params) => {
        let id = params.get("id");
        this.isLoading = true;
        if (id) {
          this.isEditMode = true;
          this.roleService
            .getRole(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              this.role = data;
              this.getActionsList();
            });
        } else {
          this.isEditMode = false;
          this.role = {
            roleClaims: [],
            userRoles: [],
          };
          this.getActionsList();
        }
      });
  }

  getActionsList() {
    this.roleService
      .getActions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.actionsList = data;
        this.getPagesList();
      });
  }

  getPagesList() {
    this.roleService
      .getPages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.pagesList = data;
        this.setUpData();
      });
  }

  setUpData() {
    this.pages = this.pagesList
      .filter((p: any) => !p.excludeFromRoleEditor)
      .map((p: any) => {
        const pageActions = this.actionsList.filter((c) => c.pageId === p.id);
        return Object.assign({}, p, { pageActions: pageActions });
      });

    if (this.role && this.role.roleClaims) {
      const validActionIds = new Set();
      this.pages.forEach((p: any) => {
        p.pageActions.forEach((a: any) => validActionIds.add(a.id));
      });
      this.role.roleClaims = this.role.roleClaims.filter((c) =>
        validActionIds.has(c.actionId),
      );
    }
    this.syncAllSelected();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  selectAll(event: any) {
    const checked = event?.target?.checked ?? event?.checked ?? false;
    this.allSelected = checked;
    if (checked) {
      this.pages.forEach((page) => {
        page.pageActions.forEach((action) => {
          if (!this.checkPermission(action.id)) {
            this.role.roleClaims.push({
              roleId: this.role.id,
              claimType: action.code,
              claimValue: "",
              actionId: action.id,
            });
          }
        });
      });
    } else {
      this.role.roleClaims = [];
    }
  }

  isPageSelected(page: Page): boolean {
    return (
      page.pageActions?.every((action) => this.checkPermission(action.id)) ??
      false
    );
  }

  onPageSelect(event: any, page: Page) {
    if (event.target.checked) {
      page.pageActions.forEach((action) => {
        if (!this.checkPermission(action.id)) {
          this.role.roleClaims.push({
            roleId: this.role.id,
            claimType: action.code,
            claimValue: "",
            actionId: action.id,
          });
        }
      });
    } else {
      const actions = page.pageActions?.map((c) => c.id);
      this.role.roleClaims = this.role.roleClaims.filter(
        (c) => actions.indexOf(c.actionId) < 0,
      );
    }
    this.syncAllSelected();
  }

  onPermissionChange(event: any, page: Page, action: any) {
    if (event.target.checked) {
      this.role.roleClaims.push({
        roleId: this.role.id,
        claimType: action.code,
        claimValue: "",
        actionId: action.id,
      });
    } else {
      const roleClaimToRemove = this.role.roleClaims.find(
        (c) => c.actionId === action.id,
      );
      const index = this.role.roleClaims.indexOf(roleClaimToRemove, 0);
      if (index > -1) {
        this.role.roleClaims.splice(index, 1);
      }
    }
    this.syncAllSelected();
  }

  checkPermission(actionId: string): boolean {
    const pageAction = this.role.roleClaims.find(
      (c) => c.actionId === actionId,
    );
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  syncAllSelected() {
    this.allSelected =
      this.pages?.length > 0 &&
      this.pages.every((page) => this.isPageSelected(page));
  }

  saveRole(): void {
    if (!this.role.name) {
      this.translate
        .get("ROLES.ADD.ERRORS.PLEASE_ENTER_ROLE_NAME")
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessage: string) => {
          this.toastrService.error(translatedMessage);
        });
      return;
    }
    if (this.role.roleClaims.length == 0) {
      this.translate
        .get("ROLES.ADD.ERRORS.PLEASE_SELECT_AT_LEAST_ONE_PERMISSION")
        .pipe(takeUntil(this.destroy$))
        .subscribe((translatedMessage: string) => {
          this.toastrService.error(translatedMessage);
        });
      return;
    }
    if (!this.role.id)
      this.roleService
        .addRole(this.role)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.translate
            .get("ROLES.ADD.TOAST.ROLE_SAVED_SUCCESSFULLY")
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage);
            });
          this.router.navigate(["/user/role"]);
        });
    else
      this.roleService
        .updateRole(this.role)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.translate
            .get("ROLES.ADD.TOAST.ROLE_SAVED_SUCCESSFULLY")
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.toastrService.success(translatedMessage);
            });
          this.router.navigate(["/user/role"]);
        });
  }
}
