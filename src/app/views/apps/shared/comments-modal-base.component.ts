import { ChangeDetectorRef, Directive, OnDestroy, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive()
export abstract class CommentsModalBaseComponent implements OnInit, OnDestroy {
  loading = false;
  errorMessage: string | null = null;
  comments: any[] = [];
  canDeleteComments = false;
  confirmingDeleteId: string | null = null;

  protected destroy$ = new Subject<void>();

  constructor(
    public bsModalRef: BsModalRef,
    protected translateService: TranslateService,
    protected toastr: ToastrService,
    protected cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  abstract loadData(): void;

  deleteComment(comment: any): void {
    if (!this.canDeleteComments) return;
    if (!comment?.id) return;

    this.confirmingDeleteId = comment.id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(comment: any): void {
    if (!comment?.id || !this.canDeleteComments) return;
    this.executeDelete(comment);
  }

  protected abstract executeDelete(comment: any): void;

  close(): void {
    this.bsModalRef.hide();
  }

  protected handleError(err: any, fallbackKey: string): void {
    this.loading = false;
    const msg = err?.error?.message;
    if (msg) {
      this.errorMessage = typeof msg === "string" ? msg : String(msg);
    } else {
      this.translateService
        .get(fallbackKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe((translated: string) => {
          if (translated === fallbackKey) {
            this.translateService
              .get("SHARED.ERRORS.DEFAULT")
              .pipe(takeUntil(this.destroy$))
              .subscribe((def: string) => {
                this.errorMessage = def;
                this.cdr.markForCheck();
              });
          } else {
            this.errorMessage = translated;
            this.cdr.markForCheck();
          }
        });
    }
    this.cdr.markForCheck();
  }

  protected handleSuccess(
    msgKey: string,
    onCommentsChanged?: () => void,
  ): void {
    this.confirmingDeleteId = null;
    if (onCommentsChanged) {
      onCommentsChanged();
    }

    this.translateService
      .get(msgKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: string) => {
        this.toastr.success(msg);
        this.cdr.markForCheck();
      });
  }
}
