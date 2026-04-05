import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BlogService } from "@app/views/apps/blog/blog.service";
import { Blog } from "@app/shared/models/blog.model";
import { environment } from "src/environments/environment";
import { RtlService } from "@app/core/rtl.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit, OnDestroy {
  blogs: Blog[] | null = null;
  isRtl = false;
  private destroy$ = new Subject<void>();

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private rtlService: RtlService,
  ) {}

  ngOnInit(): void {
    this.rtlService.getIsRtl$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRtl: boolean) => {
      this.isRtl = isRtl;
    });
    this.getBlogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBlogs() {
    this.blogService.allBlogs().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.blogs = data;
        } else {
          console.error(
            "Error/Invalid data format during blogs retrieval:",
            data,
          );
          this.blogs = [];
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des blogs:", error);
        this.blogs = [];
        this.cdr.markForCheck();
      },
    });
  }

  getHost() {
    return environment.apiUrl;
  }
}
