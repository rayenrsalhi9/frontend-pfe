import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '@app/core/security/security.service';
import { SusbcribeModalComponent } from '@app/shared/components/susbcribe-modal/susbcribe-modal.component';
import { BlogService } from '@app/views/apps/blog/blog.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.scss']
})
export class BlogPreviewComponent implements OnInit {

  blog: any = {}
  comment: any

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalService: BsModalService,
  ) { }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')
      if (id) {
        this.blogService.getBlog(id).subscribe(
          (data: any) => {
            this.blog = data
            this.cdr.markForCheck()
          }
        )
      }
    })
  }

  addReaction(reaction) {
    if (this.securityService.isGuestUser() || this.securityService.isUserAuthenticate()) {
      this.blogService.reactionBlog(this.blog.id,{type:reaction}).subscribe(
        (data:any) => {
          console.log(data);
          this.blog.reactionsUp = data.reactionsUp
          this.blog.reactionsDown = data.reactionsDown
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
      this.blogService.commentBlog(this.blog.id,{comment:this.comment}).subscribe(
        (data:any) => {
          console.log(data);
          this.blog.comments = data.comments
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

}
