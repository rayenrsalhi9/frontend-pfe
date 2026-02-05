import { Component, OnInit } from '@angular/core';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Message } from '../chat.interface';
import { PusherService } from '@app/shared/services/pusher.service';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '@app/core/security/security.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { Subject } from 'rxjs';
import { Conversation } from '@app/shared/enums/conversation';
import { TranslateService } from '@ngx-translate/core'; 


@Component({
  selector: 'app-add-conversation',
  templateUrl: './add-conversation.component.html',
  styleUrls: ['./add-conversation.component.css']
})
export class AddConversationComponent implements OnInit {

  users: User[]
  currentUser: any
  selectedUser: any
  title: any
  type: any
  conversationId: any
  public onClose: Subject<Conversation> = new Subject<Conversation>();

  constructor(
    private commonService: CommonService,
    public bsModalRef: BsModalRef,
    private securityService: SecurityService,
    private conversationService: ConversationService,
    private pusherService: PusherService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail().user;
    this.getUsers();
    /* this.authenticationService.currentUser.subscribe(
      data=>{
        this.currentUser = data.user
      }
    ) */
  }

  getUsers() {
    this.commonService
      .getUsersForDropdown()
      .subscribe((users: User[]) => (this.users = users));
  }
  selectUser(event: any) {
    this.selectedUser = event
  }

  closeConver() {
    this.bsModalRef.hide()
  }

  createConversation() {

    if (this.type == 'group') {

      const users = this.selectedUser.map((u) => {
        return u.id
      })

      this.conversationService.createConversation({ users: [...users, this.currentUser.id], title: this.title, new: true }).subscribe(
        async (data: Conversation) => {
          this.translate.get('CHAT.TOAST.GroupAddedSuccessfully').subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage); 
          }); 
          await this.onClose.next(data);
          this.bsModalRef.hide()
        }
      )
     

    }

    if (this.type == 'user') {

      if (this.selectedUser === undefined || (Array.isArray(this.selectedUser) && this.selectedUser.length === 0)) {
        // selectedUser is empty
        this.translate.get('CHAT.TOAST.SelectedUserEmpty').subscribe((translatedMessage: string) => {
          this.toastr.error(translatedMessage); 
        }); 
      } else {
        // selectedUser is not empty
        this.conversationService.conversationAddUser({
          conversationId: this.conversationId,
          title: this.title,
          selectedUser: this.selectedUser
        }).subscribe(
          (data: any) => {
            this.translate.get('CHAT.TOAST.UserAddedSuccessfully').subscribe((translatedMessage: string) => {
              this.toastr.success(translatedMessage); 
            }); 
            this.onClose.next(data);
            this.bsModalRef.hide()
          },
        )
      }
      
    }



    /* this.pusherService.sendMEssage(formData).subscribe(
      (data:any)=>{
        this.toastr.success('Conversation added')
        this.closeConver()
      }
    ) */

  }


}
