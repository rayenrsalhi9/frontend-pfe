import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { BlogService } from "@app/views/apps/blog/blog.service";
import { Blog } from "@app/shared/models/blog.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  blogs: Blog[] | null = null;

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs() {
    this.blogService.allBlogs().subscribe({
      next: (data: any) => {
        this.blogs = data;
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
