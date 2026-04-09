import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { Role } from "@app/shared/enums/role";
import { User } from "@app/shared/enums/user-auth";
import { UserRoles } from "@app/shared/enums/user-roles";
import { CommonService } from "@app/shared/services/common.service";
import { RoleService } from "@app/shared/services/role.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { forkJoin, of, Subject as RxSubject } from "rxjs";
import { catchError, finalize, switchMap, takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-user-roles",
  templateUrl: "./user-roles.component.html",
  styleUrls: ["./user-roles.component.scss"],
})
export class UserRolesComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  userRoleMapping: { [roleId: string]: UserRoles[] } = {};
  selectedUserRoleIds: string[] = [];
  initialSelectedUserRoleIds: string[] = [];

  searchText: string = "";
  searchSubject: Subject<string> = new Subject<string>();

  isLoading: boolean = true;
  isSaving: boolean = false;
  isModalOpen: boolean = false;
  selectedUser: User = null;

  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;
  Math = Math;

  private destroy$ = new RxSubject<void>();

  constructor(
    private commonService: CommonService,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initSearch(): void {
    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.applyFilter();
      });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText = value;
    this.searchSubject.next(value);
  }

  private applyFilter(): void {
    if (!this.allUsers) {
      this.filteredUsers = [];
      return;
    }

    if (!this.searchText.trim()) {
      this.filteredUsers = this.allUsers;
    } else {
      const search = this.searchText.toLowerCase();
      this.filteredUsers = (this.allUsers || []).filter(
        (user) =>
          (user.firstName || "").toLowerCase().includes(search) ||
          (user.lastName || "").toLowerCase().includes(search) ||
          (user.userName || "").toLowerCase().includes(search) ||
          (user.email && user.email.toLowerCase().includes(search)),
      );
    }

    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.cdr.markForCheck();
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredUsers.slice(start, end);
  }

  get totalUsers(): number {
    return this.filteredUsers.length;
  }

  get showPagination(): boolean {
    return this.totalUsers > this.pageSize;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.markForCheck();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  initData(): void {
    this.isLoading = true;

    forkJoin({
      roles: this.commonService.getRolesForDropdown().pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error("Error loading roles:", err);
          return of([] as Role[]);
        }),
      ),
      users: this.commonService.getUsersForDropdown().pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error("Error loading users:", err);
          return of([] as User[]);
        }),
      ),
    })
      .pipe(
        switchMap(({ roles, users }) => {
          this.roles = Array.isArray(roles) ? roles : [];
          this.allUsers = Array.isArray(users) ? users : [];
          this.filteredUsers = this.allUsers;
          this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

          if (this.roles.length === 0) {
            return of([] as UserRoles[][]);
          }

          const roleRequests = this.roles.map((role) =>
            this.roleService.getRoleUsers(role.id).pipe(
              catchError((error) => {
                console.error(
                  `Error loading users for role ${role.id}:`,
                  error,
                );
                return of([] as UserRoles[]);
              }),
            ),
          );

          return forkJoin(roleRequests);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (results: UserRoles[][]) => {
          if (this.roles && results.length > 0) {
            results.forEach((users, index) => {
              const roleId = this.roles[index].id;
              this.userRoleMapping[roleId] = users;
            });
          }
        },
        error: (error) => {
          console.error("Critical error during data initialization:", error);
        },
      });
  }

  getUserRoles(userId: string | number): Role[] {
    const userRoles: Role[] = [];
    if (!this.roles || !userId) return userRoles;

    for (const role of this.roles) {
      const usersInRole = this.userRoleMapping[role.id];
      if (usersInRole && usersInRole.some((ur) => ur.userId === userId)) {
        userRoles.push(role);
      }
    }
    return userRoles;
  }

  getUserAvatar(user: User): string {
    if (user.avatar) {
      return environment.apiUrl + user.avatar;
    }
    return "/assets/images/avatars/thumb-16.jpg";
  }

  getUserFullName(user: User): string {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }

  openRoleModal(user: User): void {
    this.selectedUser = user;

    this.selectedUserRoleIds = [];
    if (this.roles && this.roles.length > 0) {
      this.roles.forEach((role) => {
        const usersInRole = this.userRoleMapping[role.id];
        if (usersInRole && usersInRole.some((ur) => ur.userId === user.id)) {
          this.selectedUserRoleIds.push(role.id);
        }
      });
    }

    this.initialSelectedUserRoleIds = [...this.selectedUserRoleIds];
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  hasRole(roleId: string): boolean {
    return this.selectedUserRoleIds.includes(roleId);
  }

  toggleRole(role: Role): void {
    const hasRole = this.hasRole(role.id);

    if (hasRole) {
      this.selectedUserRoleIds = this.selectedUserRoleIds.filter(
        (rid) => rid !== role.id,
      );
    } else {
      this.selectedUserRoleIds.push(role.id);
    }
    this.cdr.markForCheck();
  }

  hasChanges(): boolean {
    if (
      this.selectedUserRoleIds.length !== this.initialSelectedUserRoleIds.length
    ) {
      return true;
    }

    return !this.selectedUserRoleIds.every((roleId) =>
      this.initialSelectedUserRoleIds.includes(roleId),
    );
  }

  saveUserRoles(): void {
    if (!this.selectedUser || this.isSaving) return;

    if (!this.hasChanges()) {
      this.toastrService.info(
        this.translate.instant("USERROLE.TOAST.NO_CHANGES"),
      );
      this.closeModal();
      return;
    }

    this.isSaving = true;
    const userId = this.selectedUser.id;
    let updateCount = 0;
    let errorCount = 0;
    const updates: Promise<void>[] = [];

    this.roles.forEach((role) => {
      const currentUsersInRole = this.userRoleMapping[role.id] || [];
      const userIsInRole = currentUsersInRole.some(
        (ur) => ur.userId === userId,
      );
      const userShouldBeInRole = this.selectedUserRoleIds.includes(role.id);

      if (userIsInRole !== userShouldBeInRole) {
        let updatedUsers: UserRoles[];

        if (userShouldBeInRole) {
          updatedUsers = [
            ...currentUsersInRole,
            {
              userId: userId,
              roleId: role.id,
              userName: this.selectedUser.userName,
              firstName: this.selectedUser.firstName,
              lastName: this.selectedUser.lastName,
            } as UserRoles,
          ];
        } else {
          updatedUsers = currentUsersInRole.filter(
            (ur) => ur.userId !== userId,
          );
        }

        const updatePromise = new Promise<void>((resolve) => {
          this.roleService
            .updateRoleUsers(role.id, updatedUsers)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                updateCount++;
                this.userRoleMapping[role.id] = updatedUsers;
                resolve();
              },
              error: (error) => {
                errorCount++;
                console.error(`Error updating role ${role.id}:`, error);
                resolve();
              },
            });
        });

        updates.push(updatePromise);
      }
    });

    if (updates.length === 0) {
      this.isSaving = false;
      this.toastrService.info(
        this.translate.instant("USERROLE.TOAST.NO_CHANGES"),
      );
      this.closeModal();
      return;
    }

    Promise.all(updates)
      .then(() => {
        const user = this.selectedUser;
        if (errorCount === 0) {
          this.toastrService.success(
            this.translate.instant("USERROLE.TOAST.UPDATED_SUCCESS", {
              firstName: user?.firstName,
              lastName: user?.lastName,
            }),
          );
        } else if (updateCount > 0) {
          this.toastrService.warning(
            this.translate.instant("USERROLE.TOAST.PARTIAL_SUCCESS", {
              errorCount: errorCount,
            }),
          );
        } else {
          this.toastrService.error(
            this.translate.instant("USERROLE.TOAST.UPDATE_ERROR"),
          );
        }

        if (updateCount > 0 || errorCount === 0) {
          this.closeModal();
        }
      })
      .finally(() => {
        this.isSaving = false;
        this.cdr.markForCheck();
      });
  }

  closeModal(): void {
    if (this.isSaving) return;
    this.isModalOpen = false;
    this.selectedUser = null;
    this.selectedUserRoleIds = [];
    this.initialSelectedUserRoleIds = [];
    this.cdr.markForCheck();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.isSaving) return;
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscapePress(event: KeyboardEvent): void {
    if (this.isModalOpen && !this.isSaving) {
      this.closeModal();
    }
  }
}
