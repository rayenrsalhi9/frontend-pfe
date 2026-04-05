import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { BlogService } from "@app/views/apps/blog/blog.service";
import { Blog } from "@app/shared/models/blog.model";
import { environment } from "src/environments/environment";
import { RtlService } from "@app/core/rtl.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  blogs: Blog[] | null = null;
  isRtl = false;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private rtlService: RtlService,
  ) {}

  ngOnInit(): void {
    this.rtlService.getIsRtl$().subscribe((isRtl: boolean) => {
      this.isRtl = isRtl;
    });
    this.getBlogs();
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
