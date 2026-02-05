import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { SusbcribeModalComponent } from '@app/shared/components/susbcribe-modal/susbcribe-modal.component';
import { ForumService } from '@app/views/apps/forum/forum.service';
import { BsModalService } from 'ngx-bootstrap/modal';

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

  deleteComment(id:any) {
    if (this.securityService.isGuestUser() || this.securityService.isUserAuthenticate()) {
      this.forumService.deleteComment(id).subscribe(
        (data:any) => {
          console.log(data);
          location.reload()
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

}
