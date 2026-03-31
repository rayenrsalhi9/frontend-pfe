import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { ForumThread } from "./forum-thread.interface";

@Component({
  selector: "app-forum",
  templateUrl: "./forum.component.html",
  styleUrls: ["./forum.component.scss"],
})
export class ForumComponent implements OnInit {
  rows: ForumThread[] | null = null;

  categories = [];
  tags = [];
  sort = [];
  status = [];

  constructor(
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
  ) {}

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
