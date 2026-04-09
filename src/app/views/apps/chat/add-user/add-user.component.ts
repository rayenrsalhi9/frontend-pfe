import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from '@app/shared/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConversationService } from '@app/shared/services/conversation.service';
import { SecurityService } from '@app/core/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@app/shared/enums/user-auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  @Input() conversationId: number | string | null = null;
  @Input() currentMembers: User[] = [];

  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: any;
  selectedUser: User | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  public onClose: Subject<any> = new Subject<any>();

  constructor(
    private commonService: CommonService,
    public bsModalRef: BsModalRef,
    private securityService: SecurityService,
    private conversationService: ConversationService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail().user;
    this.getUsers();
  }

  getHost(): string {
    return environment.apiUrl;
  }

  getUsers() {
    this.commonService.getUsersWithClaim('CHAT_VIEW_CHATS').subscribe({
      next: (users: User[]) => {
        const memberIds = this.currentMembers.map(m => m.id);
        this.users = users.filter(u => 
          u.id !== this.currentUser.id && 
          !memberIds.includes(u.id)
        );
        this.filteredUsers = this.users;
      },
      error: () => {
        this.users = [];
        this.filteredUsers = [];
        this.translate.get('CHAT.ERROR.LOAD_USERS_FAILED').subscribe((msg: string) => {
          this.toastr.error(msg);
        });
      }
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

  isSelected(user: User): boolean {
    return this.selectedUser?.id === user.id;
  }

  addUser() {
    if (!this.selectedUser) {
      this.translate.get('CHAT.TOAST.PLEASE_SELECT_USER').subscribe((msg: string) => {
        this.toastr.error(msg);
      });
      return;
    }

    this.isLoading = true;

    this.conversationService.conversationAddUser({
      conversationId: this.conversationId,
      selectedUser: this.selectedUser
    }).subscribe({
      next: (data: any) => {
        this.translate.get('CHAT.TOAST.USER_ADDED_SUCCESSFULLY').subscribe((msg: string) => {
          this.toastr.success(msg);
        });
        this.onClose.next(data);
        this.bsModalRef.hide();
      },
      error: () => {
        this.isLoading = false;
        this.translate.get('CHAT.TOAST.FAILED_TO_ADD_USER').subscribe((msg: string) => {
          this.toastr.error(msg);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.onClose.complete();
  }

  cancel() {
    this.bsModalRef.hide();
  }
}