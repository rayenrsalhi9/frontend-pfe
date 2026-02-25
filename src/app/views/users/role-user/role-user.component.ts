import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Role } from "@app/shared/enums/role";
import { User } from "@app/shared/enums/user-auth";
import { UserRoles } from "@app/shared/enums/user-roles";
import { CommonService } from "@app/shared/services/common.service";
import { RoleService } from "@app/shared/services/role.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-role-user",
  templateUrl: "./role-user.component.html",
  styleUrls: ["./role-user.component.css"],
})
export class RoleUserComponent implements OnInit {
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

  constructor(
    private commonService: CommonService,
    private roleService: RoleService,
    private cdk: ChangeDetectorRef,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
  }

  getRoles() {
    this.commonService.getRolesForDropdown().subscribe(
      (roles: Role[]) => {
        this.roles = roles;
        this.loadRoleUsersForAll();
        this.cdk.markForCheck();
      },
      (error) => {
        console.error("Error loading roles:", error);
        this.isLoading = false;
        this.cdk.markForCheck();
      },
    );
  }

  loadRoleUsersForAll() {
    if (!this.roles || this.roles.length === 0) {
      this.isLoading = false;
      return;
    }

    let loadedCount = 0;

    this.roles.forEach((role) => {
      this.roleService.getRoleUsers(role.id).subscribe(
        (users: UserRoles[]) => {
          this.userRoleMapping[role.id] = users;
          loadedCount++;

          if (loadedCount === this.roles.length) {
            this.isLoading = false;
          }
          this.cdk.markForCheck();
        },
        (error) => {
          console.error(`Error loading users for role ${role.id}:`, error);
          loadedCount++;

          if (loadedCount === this.roles.length) {
            this.isLoading = false;
          }
          this.cdk.markForCheck();
        },
      );
    });
  }

  getUsers() {
    this.commonService.getUsersForDropdown().subscribe(
      (users: User[]) => {
        this.allUsers = users;
        this.filteredUsers = users;
        this.cdk.markForCheck();
      },
      (error) => {
        console.error("Error loading users:", error);
        this.cdk.markForCheck();
      },
    );
  }

  filterUsers() {
    if (!this.searchText.trim()) {
      this.filteredUsers = this.allUsers;
    } else {
      const search = this.searchText.toLowerCase();
      this.filteredUsers = this.allUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.userName.toLowerCase().includes(search) ||
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
    if (!this.selectedUser) return;

    if (!this.hasChanges()) {
      this.toastrService.info("No role changes made");
      this.closeModal();
      return;
    }

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
          this.roleService.updateRoleUsers(role.id, updatedUsers).subscribe(
            () => {
              updateCount++;
              this.userRoleMapping[role.id] = updatedUsers;
              resolve();
            },
            (error) => {
              errorCount++;
              console.error(`Error updating role ${role.id}:`, error);
              resolve();
            },
          );
        });

        updates.push(updatePromise);
      }
    });

    if (updates.length === 0) {
      this.toastrService.info("No role changes made");
      this.closeModal();
      return;
    }

    Promise.all(updates).then(() => {
      if (errorCount === 0) {
        this.toastrService.success(
          `Roles updated successfully for ${this.selectedUser.firstName} ${this.selectedUser.lastName}`,
        );
      } else if (updateCount > 0) {
        this.toastrService.warning(
          `Some roles were updated, but ${errorCount} failed. Please try again.`,
        );
      } else {
        this.toastrService.error(`Error updating roles. Please try again.`);
      }

      this.closeModal();
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
