import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Role } from '@app/shared/enums/role';
import { User } from '@app/shared/enums/user-auth';
import { UserRoles } from '@app/shared/enums/user-roles';
import { CommonService } from '@app/shared/services/common.service';
import { RoleService } from '@app/shared/services/role.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.css']
})
export class RoleUserComponent implements OnInit {

  roles: Role[];
  allUsers: User[];
  selectedRole: Role = null;
  roleUsers: UserRoles[] = [];
  otherUsers: UserRoles[] = [];
  selectedRoleId: any;
  constructor(
    private commonService: CommonService,
    private roleService: RoleService,
    private cdk:ChangeDetectorRef,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
  }

  addUser(event: CdkDragDrop<UserRoles[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const userRolesToSave = [].concat(this.roleUsers);
      userRolesToSave.push(event.previousContainer.data[event.previousIndex])
      this.roleService.updateRoleUsers(this.selectedRole.id, userRolesToSave).subscribe(() => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.toastrService.success(`User Added Successfully to Role ${this.selectedRole.name}`);
        this.cdk.markForCheck()
      }, () => {
        this.roleUsers.splice(event.previousIndex, 1);
        this.toastrService.error(`Error While Adding User to Role ${this.selectedRole.name}`);
        this.cdk.markForCheck()
      });
    }
    this.cdk.detectChanges()
  }

  removeUser(event: CdkDragDrop<UserRoles[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const userRolesToSave = this.roleUsers.filter(d => event.previousContainer.data[event.previousIndex].userId != d.userId);
      this.roleService.updateRoleUsers(this.selectedRole.id, userRolesToSave).subscribe(() => {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.toastrService.success(`User Removed Successfully from Role ${this.selectedRole.name}`);
        this.cdk.markForCheck()
      }, () => {
        this.toastrService.error(`Error While Removing User from Role ${this.selectedRole.name}`);
        this.cdk.markForCheck()
      });
    }
    this.cdk.detectChanges()
  }

  addAllUser() {
    const userRolesToSave = this.allUsers.map(ds => {
      return {
        userId: ds.id,
        roleId: this.selectedRole.id,
        userName: ds.userName,
        firstName: ds.firstName,
        lastName: ds.lastName
      }
    });
    this.roleService.updateRoleUsers(this.selectedRole.id, userRolesToSave).subscribe(() => {
      this.toastrService.success(`All Users Added Successfully to ${this.selectedRole.name}`);
      this.roleUsers = userRolesToSave;
      this.otherUsers = [];
      this.cdk.markForCheck()
    });
    this.cdk.detectChanges()
  }

  removeAllUser() {
    this.roleService.updateRoleUsers(this.selectedRole.id, []).subscribe(() => {
      this.toastrService.success(`All Users Removed Successfully from ${this.selectedRole.name}`);
      this.roleUsers = [];
      this.otherUsers = this.allUsers.map(ds => {
        return {
          userId: ds.id,
          roleId: this.selectedRole.id,
          userName: ds.userName,
          firstName: ds.firstName,
          lastName: ds.lastName
        }
      });
      this.cdk.markForCheck()
    });
    this.cdk.detectChanges()
  }

  onRoleChange(event?:any) {
    this.selectedRoleId = event
    this.selectedRole = this.roles.find(c => c.id === event);
    this.roleService.getRoleUsers(event).subscribe((users: UserRoles[]) => {
      this.roleUsers = users;
      const selectedUserIds = this.roleUsers.map(m => m.userId);
      this.otherUsers = this.allUsers.filter(d => selectedUserIds.indexOf(d.id) < 0)
        .map(ds => {
          return {
            userId: ds.id,
            roleId: event,
            userName: ds.userName,
            firstName: ds.firstName,
            lastName: ds.lastName
          }
        });
        this.cdk.markForCheck()
    });
    this.cdk.detectChanges()
  }

  getRoles() {
    this.commonService.getRolesForDropdown()
      .subscribe((roles: Role[]) => {
        this.roles = roles;
        if (this.roles.length > 0) {
          this.selectedRole = this.roles[0];
          this.selectedRoleId = this.roles[0].id;
          this.onRoleChange(this.roles[0].id);
        }
      });
  }

  getUsers() {
    this.commonService.getUsersForDropdown().subscribe((users: User[]) => {
      this.allUsers = users;
      this.otherUsers = users.map(ds => {
        return {
          userId: ds.id,
          roleId: '',
          userName: ds.userName,
          firstName: ds.firstName,
          lastName: ds.lastName
        }
      });;
    });
  }

}
