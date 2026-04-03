import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { ForumThread } from "./forum-thread.interface";

@Component({
  selector: "app-forum",
  templateUrl: "./forum.component.html",
  styleUrls: ["./forum.component.scss"],
})
export class ForumComponent implements OnInit {
  rows: ForumThread[] | null = null;
  isRtl = false;

  categories = [];
  tags = [];
  sort = [];
  status = [];

  constructor(
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isRtl = document.dir === "rtl";
    }
  }

  ngOnInit(): void {
    this.getAllForums();
  }

  getAllForums() {
    this.forumService.allForums().subscribe(
      (data: any) => {
        this.rows = data;
        this.cdr.markForCheck();
      },
      (error: any) => {
        console.log(error);
      },
    );
  }

  // TODO: handle category change
  onCategoryChange(data: any) {}

  trackByThreadId(index: number, row: ForumThread) {
    return row.id;
  }
}
