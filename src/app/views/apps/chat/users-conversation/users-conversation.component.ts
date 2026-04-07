import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { Conversation } from '@app/shared/enums/conversation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { SecurityService } from '@app/core/security/security.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from '@app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-users-conversation',
  templateUrl: './users-conversation.component.html',
  styleUrls: ['./users-conversation.component.css']
})
export class UsersConversationComponent implements OnInit {

  @Input() conversation: Conversation;
  currentUserId: string;

  constructor(
    public bsModalRef: BsModalRef,
    private securityService: SecurityService,
    private conversationService: ConversationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService
  ) { }

  getHost() {
    return environment.apiUrl;
  }

  ngOnInit(): void {
    this.currentUserId = this.securityService.getUserDetail().user.id;
    this.bsModalRef.setClass('modal-sm');
  }

  removeUser(member: any) {
    this.translate.get('CHAT.LABELS.REMOVE_USER_CONFIRM').subscribe((confirmMsg: string) => {
      this.translate.get('CHAT.BUTTONS.CONFIRM').subscribe((confirmBtn: string) => {
        this.translate.get('CHAT.BUTTONS.CANCEL').subscribe((cancelBtn: string) => {
          const bsModalRef = this.modalService.show(ConfirmModalComponent, {
            class: 'modal-confirm-custom',
            initialState: {
              title: confirmMsg,
              message: confirmMsg,
              button: {
                cancel: cancelBtn,
                confirm: confirmBtn,
              },
            },
          });
          bsModalRef.content.onClose.subscribe((result: boolean) => {
            if (result) {
              this.conversationService.conversationRemoveUser({
                conversationId: this.conversation.id,
                userId: member.id
              }).subscribe({
                next: () => {
                  this.translate.get('CHAT.TOAST.USER_REMOVED_SUCCESSFULLY').subscribe((msg: string) => {
                    this.toastr.success(msg);
                  });
                  this.conversation.users = this.conversation.users.filter(u => u.id !== member.id);
                  this.cdr.markForCheck();
                },
                error: () => {
                  this.translate.get('CHAT.TOAST.FAILED_TO_REMOVE_USER').subscribe((msg: string) => {
                    this.toastr.error(msg);
                  });
                }
              });
            }
          });
        });
      });
    });
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
