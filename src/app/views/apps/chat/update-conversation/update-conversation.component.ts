import { Component, OnInit } from '@angular/core';
import { Conversation } from '@app/shared/enums/conversation';
import { CommonService } from '@app/shared/services/common.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-update-conversation',
  templateUrl: './update-conversation.component.html',
  styleUrls: ['./update-conversation.component.css']
})
export class UpdateConversationComponent implements OnInit {

  conversation: Conversation;
  originalTitle: string;
  hasTitleChanged: boolean = false;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private commonService: CommonService,
    private conversationService: ConversationService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.originalTitle = this.conversation.title || '';
  }

  onTitleChange() {
    this.hasTitleChanged = this.conversation.title !== this.originalTitle;
  }

  updateConversation() {
    if (!this.conversation.title?.trim()) {
      return;
    }

    this.isLoading = true;
    this.conversationService.updateConversation(this.conversation.id, { title: this.conversation.title })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.translate.get('CHAT.TOAST.GROUP_UPDATED_SUCCESSFULLY').subscribe((msg: string) => {
            this.toastr.success(msg);
          });
          this.bsModalRef.hide();
        },
        error: () => {
          this.isLoading = false;
          this.translate.get('CHAT.TOAST.FAILED_TO_UPDATE_GROUP').subscribe((msg: string) => {
            this.toastr.error(msg);
          });
        }
      });
  }

  closeConver() {
    this.bsModalRef.hide();
  }
}
