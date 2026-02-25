import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Role } from "@app/shared/enums/role";
import { User } from "@app/shared/enums/user-auth";
import { UserRoles } from "@app/shared/enums/user-roles";
import { CommonService } from "@app/shared/services/common.service";
import { RoleService } from "@app/shared/services/role.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { forkJoin, of, Subject } from "rxjs";
import { catchError, finalize, switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-role-user",
  templateUrl: "./role-user.component.html",
  styleUrls: ["./role-user.component.css"],
})
export class RoleUserComponent implements OnInit, OnDestroy {
  roles: Role[];
  allUsers: User[];
  selectedUser: User = null;
  isModalOpen: boolean = false;

  userRoleMapping: { [roleId: string]: UserRoles[] } = {};
  selectedUserRoleIds: string[] = [];
  initialSelectedUserRoleIds: string[] = [];

  searchText: string = "";
  filteredUsers: User[] = [];
  isLoading: boolean = true;
  isSaving: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private commonService: CommonService,
    private roleService: RoleService,
    private cdk: ChangeDetectorRef,
    private toastrService: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscapePress(event: KeyboardEvent) {
    if (this.isModalOpen && !this.isSaving) {
      this.closeModal();
    }
  }

  initData() {
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
          this.cdk.markForCheck();
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

  filterUsers() {
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
    this.cdk.markForCheck();
  }

  openRoleModal(user: User) {
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
    this.cdk.markForCheck();
  }

  hasRole(roleId: string): boolean {
    return this.selectedUserRoleIds.includes(roleId);
  }

  toggleRole(role: Role) {
    const hasRole = this.hasRole(role.id);

    if (hasRole) {
      this.selectedUserRoleIds = this.selectedUserRoleIds.filter(
        (rid) => rid !== role.id,
      );
    } else {
      this.selectedUserRoleIds.push(role.id);
    }
    this.cdk.markForCheck();
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

  saveUserRoles() {
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
        if (errorCount === 0) {
          this.toastrService.success(
            this.translate.instant("USERROLE.TOAST.UPDATED_SUCCESS", {
              firstName: this.selectedUser.firstName,
              lastName: this.selectedUser.lastName,
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

        // Only close modal if there was some success
        if (updateCount > 0 || errorCount === 0) {
          this.closeModal();
        }
      })
      .finally(() => {
        this.isSaving = false;
        this.cdk.markForCheck();
      });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
    this.selectedUserRoleIds = [];
    this.initialSelectedUserRoleIds = [];
    this.cdk.markForCheck();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
