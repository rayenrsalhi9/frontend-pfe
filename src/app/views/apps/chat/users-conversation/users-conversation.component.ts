import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Conversation } from '@app/shared/enums/conversation';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-conversation',
  templateUrl: './users-conversation.component.html',
  styleUrls: ['./users-conversation.component.css']
})
export class UsersConversationComponent implements OnInit {

  conversation:Conversation

  constructor(
    public bsModalRef: BsModalRef,
    private cdr:ChangeDetectorRef
  ) { }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.bsModalRef.setClass('modal-sm')
  }

}
