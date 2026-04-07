import { Component, OnInit, Input } from "@angular/core";
import { Subject } from "rxjs";
import { CommonService } from "@app/shared/services/common.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ConversationService } from "@app/shared/services/conversation.service";
import { SecurityService } from "@app/core/security/security.service";
import { ToastrService } from "ngx-toastr";
import { User } from "@app/shared/enums/user-auth";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-create-group",
  templateUrl: "./create-group.component.html",
  styleUrls: ["./create-group.component.scss"],
})
export class CreateGroupComponent implements OnInit {
  @Input() conversationId: number | string | null = null;

  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: any;
  groupName: string = "";
  selectedUsers: Set<User> = new Set();
  searchTerm: string = "";
  isLoading: boolean = false;

  public onClose: Subject<any> = new Subject<any>();

  constructor(
    private commonService: CommonService,
    public bsModalRef: BsModalRef,
    private securityService: SecurityService,
    private conversationService: ConversationService,
    private toastr: ToastrService,
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
      this.users = users.filter((u) => u.id !== this.currentUser.id);
      this.filteredUsers = this.users;
    });
  }

  filterUsers() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter((u) => {
        const fullName =
          `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        return fullName.includes(term) || u.email.toLowerCase().includes(term);
      });
    }
  }

  toggleUser(user: User) {
    if (this.selectedUsers.has(user)) {
      this.selectedUsers.delete(user);
    } else {
      this.selectedUsers.add(user);
    }
  }

  isSelected(user: User): boolean {
    return this.selectedUsers.has(user);
  }

  selectAll() {
    this.filteredUsers.forEach((u) => this.selectedUsers.add(u));
  }

  deselectAll() {
    this.selectedUsers.clear();
  }

  get selectedCount(): number {
    return this.selectedUsers.size;
  }

  createGroup() {
    if (!this.groupName.trim()) {
      this.toastr.error("Group name is required");
      return;
    }

    if (this.selectedUsers.size === 0) {
      this.toastr.error("Please select at least one member");
      return;
    }

    this.isLoading = true;
    const userIds = Array.from(this.selectedUsers).map((u) => u.id);

    this.conversationService
      .createConversation({
        users: [...userIds, this.currentUser.id],
        title: this.groupName,
        new: true,
      })
      .subscribe({
        next: (data: any) => {
          this.toastr.success("Group created successfully");
          this.onClose.next(data);
          this.bsModalRef.hide();
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error("Failed to create group");
        },
      });
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
