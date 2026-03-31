import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, switchMap, map, filter } from "rxjs/operators";
import { SecurityService } from "@app/core/security/security.service";
import { SusbcribeModalComponent } from "@app/shared/components/susbcribe-modal/susbcribe-modal.component";
import { BlogService } from "@app/views/apps/blog/blog.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog-preview",
  templateUrl: "./blog-preview.component.html",
  styleUrls: ["./blog-preview.component.scss"],
})
export class BlogPreviewComponent implements OnInit, OnDestroy {
  blog: any = {};
  comment: any;
  user: any;
  private destroy$ = new Subject<void>();

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {}

  getHost() {
    return environment.apiUrl;
  }

  ngOnInit(): void {
    this.activeRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get("id")),
        filter((id) => !!id),
        switchMap((id) => this.blogService.getBlog(id)),
      )
      .subscribe((data: any) => {
        this.blog = data;
        this.cdr.markForCheck();
      });

    this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInfo() {
    const currentUser = localStorage.getItem("currentUser");
    const guestUser = localStorage.getItem("guestUser");

    if (currentUser) {
      this.user = JSON.parse(currentUser).user;
    } else if (guestUser) {
      this.user = JSON.parse(guestUser);
    }
  }

  hasReacted(type: string): boolean {
    if (!this.user) return false;

    const checkReaction = (r: any) => {
      if (typeof r === "string")
        return r === this.user.id || r === this.user.email;
      return (
        r?.user?.id === this.user.id ||
        r?.user?.email === this.user.email ||
        r?.id === this.user.id
      );
    };

    if (type === "up" && this.blog.reactionsUp?.length) {
      return this.blog.reactionsUp.some(checkReaction);
    } else if (type === "down" && this.blog.reactionsDown?.length) {
      return this.blog.reactionsDown.some(checkReaction);
    }
    return false;
  }

  copyLink() {
    if (!navigator.clipboard) {
      this.toastr.error("Could not copy link — please copy manually");
      return;
    }
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.toastr.success("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        this.toastr.error("Could not copy link — please copy manually");
      });
  }

  addReaction(reaction) {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.blogService.reactionBlog(this.blog.id, { type: reaction }).subscribe(
        (data: any) => {
          this.blog.reactionsUp = data.reactionsUp;
          this.blog.reactionsDown = data.reactionsDown;
        },
        (error: any) => {
          console.log(error);
        },
      );
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }

  addComment() {
    if (
      this.securityService.isGuestUser() ||
      this.securityService.isUserAuthenticate()
    ) {
      this.blogService
        .commentBlog(this.blog.id, { comment: this.comment })
        .subscribe(
          (data: any) => {
            this.blog.comments = data.comments;
            this.comment = "";
            this.cdr.markForCheck();
          },
          (error: any) => {
            console.log(error);
          },
        );
    } else {
      this.modalService.show(SusbcribeModalComponent);
    }
  }
}
