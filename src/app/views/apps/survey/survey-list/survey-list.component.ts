import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SurveyService } from "../survey.service";
import { ConfirmModalComponent } from "@app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  switchMap,
  catchError,
  tap,
  takeUntil,
  first,
} from "rxjs/operators";
import { SurveyResource } from "@app/shared/enums/survey-resource";
import { SecurityService } from "@app/core/security/security.service";

@Component({
  selector: "app-survey-list",
  templateUrl: "./survey-list.component.html",
  styleUrls: ["./survey-list.component.css"],
})
export class SurveyListComponent implements OnInit, OnDestroy {
  showMobilePanel = false;

  rows: any[] = [];
  selected = [];
  categories: any[] = ["simple", "rating", "satisfaction"];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  bsModalRef: BsModalRef;
  surveyResource: SurveyResource;
  searchSubject: Subject<void> = new Subject<void>();
  destroy$: Subject<void> = new Subject<void>();
  isLoadingResults = false;
  canViewStats = false;
  canEdit = false;
  canDelete = false;
  canPerformAnyAction = false;

  constructor(
    private surveyService: SurveyService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private securityService: SecurityService,
  ) {
    this.surveyResource = new SurveyResource();
  }

  ngOnInit(): void {
    this.canViewStats = this.securityService.hasClaim('SURVEY_VIEW_STATISTICS');
    this.canEdit = this.securityService.hasClaim('SURVEY_EDIT_SURVEY');
    this.canDelete = this.securityService.hasClaim('SURVEY_DELETE_SURVEY');
    this.canPerformAnyAction = this.canEdit || this.canDelete;

    this.searchSubject
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoadingResults = true)),
        switchMap(() =>
          this.surveyService.allSurveys(this.surveyResource).pipe(
            catchError((err) => {
              console.error(err);
              this.isLoadingResults = false;
              return of(null);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          this.rows = data;
        } else {
          this.rows = [];
        }
        this.isLoadingResults = false;
        this.cdr.markForCheck();
      });
    this.searchSubject.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllSurveys(data = this.surveyResource) {
    this.surveyResource = data;
    this.searchSubject.next();
  }

  deleteSurvey(data: any) {
    this.translateService
      .get("SURVEY.DELETE.LABEL")
      .pipe(first())
      .subscribe((translations) => {
        this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
          class: "modal-confirm-custom",
          initialState: {
            title: translations.TITLE,
            message: translations.MESSAGE,
            button: {
              cancel: translations.BUTTON.CANCEL,
              confirm: translations.BUTTON.CONFIRM,
            },
          },
        });

        this.bsModalRef.content.onClose
          .pipe(first())
          .subscribe((result: boolean) => {
            if (result) {
              this.surveyService
                .deleteSurvey(data.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                  this.translateService
                    .get("SURVEY.DELETE.TOAST.DELETED_SUCCESSFULLY")
                    .pipe(first())
                    .subscribe((translatedMessage: string) => {
                      this.toastr.success(translatedMessage);
                    });
                  this.getAllSurveys();
                });
            }
          });
      });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getAnswerCount(value: number, results: any[]) {
    return results.filter((val) => val.answer === value).length;
  }

  onNameChange(event: any) {
    let val = event.target.value;
    this.surveyResource.title = val ? val : "";
    this.surveyResource.skip = 0;
    this.searchSubject.next();
  }

  onCategoryChange(event: any) {
    this.surveyResource.type = event ? event : "";
    this.surveyResource.skip = 0;
    this.searchSubject.next();
  }

  onDateChange(event: any) {
    this.surveyResource.createdAt = event ? new Date(event).toDateString() : "";
    this.surveyResource.skip = 0;
    this.searchSubject.next();
  }

  hasClaim(claimType: string): boolean {
    return this.securityService.hasClaim(claimType);
  }
}