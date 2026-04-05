import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ForumService } from "@app/views/apps/forum/forum.service";
import { ForumThread } from "./forum-thread.interface";
import { RtlService } from "@app/core/rtl.service";

@Component({
  selector: "app-forum",
  templateUrl: "./forum.component.html",
  styleUrls: ["./forum.component.scss"],
})
export class ForumComponent implements OnInit, OnDestroy {
  rows: ForumThread[] | null = null;
  isRtl = false;
  private destroy$ = new Subject<void>();

  categories = [];
  tags = [];
  sort = [];
  status = [];

  constructor(
    private forumService: ForumService,
    private cdr: ChangeDetectorRef,
    private rtlService: RtlService,
  ) {}

  ngOnInit(): void {
    this.rtlService.getIsRtl$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRtl: boolean) => {
      this.isRtl = isRtl;
    });
    this.getAllForums();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
