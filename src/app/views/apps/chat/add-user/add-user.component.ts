import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from '@app/shared/services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConversationService } from '@app/shared/services/conversation.service';
import { SecurityService } from '@app/core/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@app/shared/enums/user-auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @Input() conversationId: number | string | null = null;
  @Input() currentMembers: User[] = [];

  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: any;
  selectedUser: User | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;

  public onClose: Subject<any> = new Subject<any>();

  constructor(
    private commonService: CommonService,
    public bsModalRef: BsModalRef,
    private securityService: SecurityService,
    private conversationService: ConversationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.securityService.getUserDetail().user;
    this.getUsers();
  }

  getHost(): string {
    return environment.apiUrl;
  }

  getUsers() {
    this.commonService.getUsersWithClaim('CHAT_VIEW_CHATS').subscribe((users: User[]) => {
      const memberIds = this.currentMembers.map(m => m.id);
      this.users = users.filter(u => 
        u.id !== this.currentUser.id && 
        !memberIds.includes(u.id)
      );
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

  isSelected(user: User): boolean {
    return this.selectedUser?.id === user.id;
  }

  addUser() {
    if (!this.selectedUser) {
      this.toastr.error('Please select a user');
      return;
    }

    this.isLoading = true;

    this.conversationService.conversationAddUser({
      conversationId: this.conversationId,
      selectedUser: this.selectedUser
    }).subscribe({
      next: (data: any) => {
        this.toastr.success('User added successfully');
        this.onClose.next(data);
        this.bsModalRef.hide();
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to add user');
      }
    });
  }

  cancel() {
    this.bsModalRef.hide();
  }
}