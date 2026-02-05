import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BlogService } from '@app/views/apps/blog/blog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  blogs = []

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getBlogs()
  }

  getBlogs() {
    this.blogService.allBlogs().subscribe(
      (data: any) => {
        this.blogs = data
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  getHost() {
    return environment.apiUrl
  }

}
