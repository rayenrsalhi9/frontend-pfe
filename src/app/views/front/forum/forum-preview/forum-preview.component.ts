import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { SusbcribeModalComponent } from '@app/shared/components/susbcribe-modal/susbcribe-modal.component';
import { ForumService } from '@app/views/apps/forum/forum.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-forum-preview',
  templateUrl: './forum-preview.component.html',
  styleUrls: ['./forum-preview.component.scss']
})
export class ForumPreviewComponent implements OnInit {

  forum:any = {}
  comment: any
  user:any

  constructor(
    private forumService:ForumService,
    private cdr:ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      if(id) {
        this.forumService.getForum(id).subscribe(
          (data:any)=>{
            this.forum = data
            this.cdr.markForCheck()
          }
        )
      }
    })
    this.getUserInfo()
  }

  getUserInfo() {
    const guestUser = localStorage.getItem('guestUser');
    console.log(guestUser);

    const currentUser = localStorage.getItem('currentUser');

    if(currentUser) {
      this.user = JSON.parse(currentUser).user;
    }
    if (guestUser) {
      this.user = JSON.parse(guestUser);
    }
    console.log(this.user);
  }


  addReaction(reaction) {
    if (this.securityService.isGuestUser() || this.securityService.isUserAuthenticate()) {
      this.forumService.reactionForum(this.forum.id,{type:reaction}).subscribe(
        (data:any) => {
          this.forum.reactionsUp = data.reactionsUp
          this.forum.reactionsHeart = data.reactionsHeart
          this.forum.reactionsDown = data.reactionsDown
        },
        (error:any) => {
          console.log(error);
        }
      )
    } else {
      console.log(false);
      this.modalService.show(SusbcribeModalComponent)
    }
  }

  addComment() {
    if (this.securityService.isGuestUser() || this.securityService.isUserAuthenticate()) {
      this.forumService.commentForum(this.forum.id,{comment:this.comment}).subscribe(
        (data:any) => {
          console.log(data);
          this.forum.comments = data.comments
          this.comment = ""
          this.cdr.markForCheck()
        },
        (error:any) => {
          console.log(error);
        }
      )
    } else {
      console.log(false);
      this.modalService.show(SusbcribeModalComponent)
    }
  }

  deleteComment(id:string) {
    if (this.securityService.isGuestUser() || this.securityService.isUserAuthenticate()) {
      // Show confirmation dialog
      if (confirm('Are you sure you want to delete this comment?')) {
        this.forumService.deleteComment(id).subscribe(
          (response: any) => {
            if (response.success) {
              // Remove comment from local array
              this.forum.comments = this.forum.comments.filter(
                (comment: any) => comment.id !== id
              );
              this.cdr.markForCheck();
              
              // Show success message
              this.toastr.success('Comment deleted successfully');
            } else {
              this.toastr.error(response.message || 'Failed to delete comment');
            }
          },
          (error: any) => {
            console.error('Delete comment error:', error);
            this.toastr.error('An error occurred while deleting the comment');
          }
        );
      }
    } else {
      console.log(false);
      this.modalService.show(SusbcribeModalComponent)
    }
  }

  // Check if user can delete a comment
  canDeleteComment(comment: any): boolean {
    if (!this.user) return false;
    
    // User can delete their own comments
    if (comment.user.email === this.user.email) {
      return true;
    }
    
    // Check if user has admin permission
    return this.securityService.hasClaim('FORUM_DELETE_COMMENT');
  }

}
