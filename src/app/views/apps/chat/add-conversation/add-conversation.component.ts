import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@app/shared/enums/user-auth';
import { CommonService } from '@app/shared/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PusherService } from '@app/shared/services/pusher.service';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '@app/core/security/security.service';
import { ConversationService } from '@app/shared/services/conversation.service';
import { Subject } from 'rxjs';
import { Conversation } from '@app/shared/enums/conversation';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-conversation',
  templateUrl: './add-conversation.component.html',
  styleUrls: ['./add-conversation.component.scss']
})
export class AddConversationComponent implements OnInit, OnDestroy {

  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: any;
  selectedUser: User | null = null;
  selectedUsers: User[] = [];
  title: string = '';
  type: string = 'group';
  conversationId: any;
  searchTerm: string = '';
  isLoading: boolean = false;
  public onClose: Subject<Conversation> = new Subject<Conversation>();

  private destroy$ = new Subject<void>();

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
  }

  getHost(): string {
    return environment.apiUrl;
  }

  getUsers() {
    this.commonService
      .getUsersWithClaim('CHAT_VIEW_CHATS')
      .subscribe((users: User[]) => {
        this.users = users.filter(u => u.id !== this.currentUser?.id);
        this.filteredUsers = this.users;
      });
  }

  filterUsers() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(u => {
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        return fullName.includes(term) || u.email.toLowerCase().includes(term);
      });
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  toggleUser(user: User) {
    const index = this.selectedUsers.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isSelected(user: User): boolean {
    if (this.type === 'group') {
      return this.selectedUsers.some(u => u.id === user.id);
    }
    return this.selectedUser?.id === user.id;
  }

  closeConver() {
    this.bsModalRef.hide();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.onClose.complete();
  }

  createConversation() {

    if (this.type == 'group') {
      if (this.selectedUsers.length === 0) {
        this.translate.get('CHAT.TOAST.SELECT_AT_LEAST_ONE_MEMBER').subscribe((msg: string) => {
          this.toastr.error(msg);
        });
        return;
      }

      const userIds = this.selectedUsers.map((u) => u.id);

      this.isLoading = true;
      this.conversationService.createConversation({
        users: [...userIds, this.currentUser?.id],
        title: this.title,
        new: true
      }).subscribe(
        async (data: Conversation) => {
          this.translate.get('CHAT.TOAST.GROUP_ADDED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
            this.toastr.success(translatedMessage);
          });
          await this.onClose.next(data);
          this.bsModalRef.hide();
        },
        (error) => {
          this.isLoading = false;
          this.translate.get('CHAT.ERROR.CREATE_CONVERSATION_FAILED').subscribe((msg: string) => {
            this.toastr.error(msg);
          });
        }
      );
    }

    if (this.type == 'user') {

      if (!this.selectedUser) {
        this.translate.get('CHAT.TOAST.SELECTED_USER_EMPTY').subscribe((translatedMessage: string) => {
          this.toastr.error(translatedMessage);
        });
      } else {
        this.isLoading = true;
        this.conversationService.conversationAddUser({
          conversationId: this.conversationId,
          title: this.title,
          selectedUser: this.selectedUser
        }).subscribe(
          (data: any) => {
            this.translate.get('CHAT.TOAST.USER_ADDED_SUCCESSFULLY').subscribe((translatedMessage: string) => {
              this.toastr.success(translatedMessage);
            });
            this.onClose.next(data);
            this.bsModalRef.hide();
          },
          (error) => {
            this.isLoading = false;
            this.translate.get('CHAT.ERROR.ADD_USER_FAILED').subscribe((msg: string) => {
              this.toastr.error(msg);
            });
          }
        );
      }
    }
  }
}
