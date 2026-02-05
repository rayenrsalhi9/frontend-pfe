import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '@app/shared/enums/page';
import { Role } from '@app/shared/enums/role';
import { User } from '@app/shared/enums/user-auth';
/* import { ActionService } from '@app/shared/services/action.service';
import { PageService } from '@app/shared/services/page.service'; */
import { RoleService } from '@app/shared/services/role.service';
import { Action } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
})
export class RoleAddComponent implements OnInit {

  pagesList: any[];
  actionsList: any[];
  pages: Page[];
  roleName:any
  role: Role = null;
  user: any
  @Output() manageUserClaimAction: EventEmitter<User> = new EventEmitter<User>(); step = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    /* private pageService: PageService,
    private actionService: ActionService, */
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService

  ) {

  }

  ngOnInit(): void {

    this.initData()
  }

  initData() {
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      if (id) {
        this.roleService.getRole(id).subscribe(
          (data: any) => {
            this.role = data
          }
        )
      } else {
        this.role = {
          roleClaims: [],
          userRoles: [],
        };
      }
      this.getActionsList()

    });
  }

  getActionsList() {
    this.roleService.getActions().subscribe(
      data => {
        this.actionsList = data
        this.getPagesList()
      }
    )
  }

  getPagesList() {
    this.roleService.getPages().subscribe(
      data => {
        this.pagesList = data
        this.setUpData()
      }
    )
  }

  setUpData() {
    this.pages = this.pagesList.map((p: any) => {
      const pageActions = this.actionsList.filter(
        (c) => c.pageId == p.id
      );
      const result = Object.assign({}, p, { pageActions: pageActions });

      return result;
    });
    this.cdr.detectChanges()
  }


  selecetAll(event: any) {
    if (event.checked) {
      this.pages.forEach((page) => {
        page.pageActions.forEach((action) => {
          if (!this.checkPermission(action.id)) {
            this.role.roleClaims.push({
              roleId: this.role.id,
              claimType: action.code,
              claimValue: '',
              actionId: action.id,
            });
          }
        });
      });
    } else {
      this.role.roleClaims = [];
    }
  }

  onPageSelect(event: any, page: Page) {
    if (event.target.checked) {
      page.pageActions.forEach((action) => {
        if (!this.checkPermission(action.id)) {
          this.role.roleClaims.push({
            roleId: this.role.id,
            claimType: action.code,
            claimValue: '',
            actionId: action.id,
          });
        }
      });
    } else {
      const actions = page.pageActions?.map((c) => c.id);
      this.role.roleClaims = this.role.roleClaims.filter(
        (c) => actions.indexOf(c.actionId) < 0
      );
    }
  }

  onPermissionChange(event: any, page: Page, action: any) {
    if (event.target.checked) {
      this.role.roleClaims.push({
        roleId: this.role.id,
        claimType: action.code,
        claimValue: '',
        actionId: action.id,
      });
    } else {
      const roleClaimToRemove = this.role.roleClaims.find(
        (c) => c.actionId === action.id
      );
      const index = this.role.roleClaims.indexOf(roleClaimToRemove, 0);
      if (index > -1) {
        this.role.roleClaims.splice(index, 1);
      }
    }
  }

  checkPermission(actionId: string): boolean {
    const pageAction = this.role.roleClaims.find(
      (c) => c.actionId === actionId
    );
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  saveRole(): void {

    if (!this.role.name) {
      this.translate.get('ROLES.ADD.ERRORS.PLEASE_ENTER_ROLE_NAME').subscribe((translatedMessage: string) => {
        this.toastrService.error(translatedMessage); 
      }); 
      return;
    }
    if (this.role.roleClaims.length == 0) {
      this.translate.get('ROLES.ADD.ERRORS.PLEASE_SELECT_AT_LEAT_ONE_PERMISSION').subscribe((translatedMessage: string) => {
        this.toastrService.error(translatedMessage); 
      });
      return;
    }
    if (!this.role.id)
      this.roleService.addRole(this.role).subscribe(() => {
        this.translate.get('ROLES.ADD.TOAST.ROLE_SAVED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage); 
        }); 
        this.router.navigate(['/user/role']);
      });
    else
      this.roleService.updateRole(this.role).subscribe(() => {
        this.translate.get('ROLES.ADD.TOAST.ROLE_SAVED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
          this.toastrService.success(translatedMessage); 
        });
        this.router.navigate(['/user/role']);
      });
  }

}
