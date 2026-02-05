import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { UserService } from '@app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'nav-profile',
  templateUrl: './nav-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.header-nav-item]': 'true'
  }
})
export class NavProfileComponent implements OnInit {

  user: any
  userImg: any = null

  public bsModalRef: BsModalRef

  constructor(
    private securityService: SecurityService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private modalService: BsModalService,

  ) { }

  profileMenuList = [
    {
      path: '/setting/profile',
      icon: 'feather icon-user',
      claims: ["show"],
      item: 'DROPDOWN_PROFILE.PROFILE'
    },
    {
      path: null,
      icon: 'feather icon-lock',
      click:()=>this.changePassword(),
      claims: ["show"],
      item: 'DROPDOWN_PROFILE.CHANGE_PWD',
    },
    {
      path: '/setting',
      icon: 'feather icon-mail',
      claims: ['EMAIL_MANAGE_SMTP_SETTINGS'],
      item: 'DROPDOWN_PROFILE.SMTP'
    },
    {
      path: '/setting/company',
      icon: 'feather icon-settings',
      claims: ['SETTING_MANAGE_PROFILE'],
      item: 'DROPDOWN_PROFILE.SETTING'
    },
    /* {
        path: '',
        icon: 'feather icon-power',
        claims: ["show"],
        item: 'Sign Out'
    } */
  ]

  getHost() {
    return environment.apiUrl
  }

  getUserData() {

    this.securityService.SecurityObject.subscribe((data: any) => {
      if (data) {
        this.userImg = data.user.avatar ? (!data.user.avatar.startsWith("data:image") ? environment.apiUrl + data.user.avatar : data.user.avatar) : null
        this.user = data.user
        this.cdr.markForCheck()
      }
    });

    /* this.userService.getUser(this.securityService.getUserDetail().user.id).subscribe((data:any)=>{
      this.userImg = data.avatar?environment.apiUrl+data.avatar:null
      this.user = data
      this.cdr.markForCheck()
    }) */
  }

  ngOnInit(): void {
    this.getUserData()
    this.userService.data$.subscribe(data => {
      this.getUserData()
    })
  }

  changePassword() {

    const initialState = {
      data: Object.assign({}, this.user),
    }

    this.modalService.show(ResetPasswordComponent,{initialState:initialState})
  }

  logout() {
    this.securityService.logout()
  }
}
