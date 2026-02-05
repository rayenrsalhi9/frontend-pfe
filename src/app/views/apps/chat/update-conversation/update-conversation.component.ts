import { Component, OnInit } from '@angular/core';
import { Conversation } from '@app/shared/enums/conversation';
import { CommonService } from '@app/shared/services/common.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-conversation',
  templateUrl: './update-conversation.component.html',
  styleUrls: ['./update-conversation.component.css']
})
export class UpdateConversationComponent implements OnInit {

  conversation:Conversation
  users:any
  selectedUsers:any[]

  constructor(
    public bsModalRef: BsModalRef,
    private commonService: CommonService,
    private conversationService:ConversationService
  ) { }


  ngOnInit(): void {
    this.commonService.getUsers().subscribe(
      (data:any)=>{
        this.users = data
        this.selectedUsers = this.conversation.users.map(usr=>usr.id)
      }
    )
  }

  updateConversation() {
    this.conversationService.updateConversation(this.conversation.id,{users:this.selectedUsers, title:this.conversation.title}).subscribe(
      data=>{
        console.log(data);
      }
    )
  }

  closeConver() {
    this.bsModalRef.hide()
  }

}
