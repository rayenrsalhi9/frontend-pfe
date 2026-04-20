import {
  Component,
  ViewChildren,
  TemplateRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  QueryList,
  ChangeDetectorRef,
} from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { startOfDay, endOfDay, isSameDay } from "date-fns";
import { Subject, Subscription } from "rxjs";
import { PopoverDirective } from "ngx-bootstrap/popover";
import { combineLatest } from "rxjs";
import { CommonService } from "@app/shared/services/common.service";
import { ReminderService } from "@app/shared/services/reminder.service";
import { ReminderResourceParameter } from "@app/shared/enums/reminder-resource-parameter";
import { HttpResponse } from "@angular/common/http";
import { User } from "@app/shared/enums/user";
import { ToastrService } from "ngx-toastr";
import {
  defineLocale,
  arLocale,
  frLocale,
  enGbLocale,
} from "ngx-bootstrap/chronos";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { DocumentService } from "@app/shared/services/document.service";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { SecurityService } from "@app/core/security/security.service";

interface CalendarAppEvent {
  id?: any;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  color?: {
    primary: string;
    secondary?: string;
  };
  category?: {
    primary: string;
    secondary?: string;
  };
  allDay?: boolean;
  cssClass?: string;
}

defineLocale("ar", arLocale);
defineLocale("fr", frLocale);
defineLocale("en", enGbLocale);

const colors: any = {
  urgent: {
    primary: "#ef2733",
    secondary: "#fde9eb",
  },
  normal: {
    primary: "#ff8911",
    secondary: "#fff4ea",
  },
  minor: {
    primary: "#3d5ef8",
    secondary: "#eef1fe",
  },
};

const prioritySelection: string[] = ["urgent", "normal", "minor"];

interface FrequencyOption {
  id: number;
  name: string;
}

interface WeekDayOption {
  id: number;
  name: string;
}

@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html",
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(PopoverDirective) popovers: QueryList<PopoverDirective>;
  viewDate: Date = new Date();
  selectedDate: Date = new Date();
  reminderResource: ReminderResourceParameter;
  modalRef: BsModalRef;
  modalMode: "add" | "edit" = "add";
  formGroup: FormGroup;
  selectedEventId: string | number;
  modalData: {
    action: string;
    event: CalendarAppEvent;
  };
  colorsSelection: any[] = [];
  refresh: Subject<any> = new Subject();
  events: CalendarAppEvent[] = [];
  selectedDayEvents: CalendarAppEvent[] = [];
  users: User[];
  documents: any[] = [];
  locale: "en" | "ar" | "fr" = "en";
  isLoading = false;
  isSubmitted = false;
  confirmingDeleteId: string | number | null = null;
  originalEventData: any = null;

  frequencies: FrequencyOption[] = [];
  weekDays: WeekDayOption[] = [];
  private modalSubscriptions: Subscription | null = null;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private reminderService: ReminderService,
    private documentService: DocumentService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private bsLocaleService: BsLocaleService,
    private securityService: SecurityService,
  ) {
    this.reminderResource = new ReminderResourceParameter();
    this.reminderResource.pageSize = 100;
    this.reminderResource.orderBy = "startDate desc";
    const lang = localStorage.getItem("lang");
    if (lang === "en_US") {
      this.locale = "en";
    } else if (lang === "fr_FR") {
      this.locale = "fr";
    } else if (lang === "ar_AR") {
      this.locale = "ar";
    } else {
      this.locale = "en";
    }
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.bsLocaleService.use(this.translate.currentLang.split("_")[0]);
    this.initTranslations();
    this.getReminders();
    this.getUsers();
    this.getDocuments();

    this.formGroup.get("frequency").valueChanges.subscribe((freq) => {
      const dayOfWeekControl = this.formGroup.get("dayOfWeek");
      if (freq === 1) {
        dayOfWeekControl.setValidators([Validators.required]);
      } else {
        dayOfWeekControl.setValidators([]);
      }
      dayOfWeekControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  initTranslations() {
    this.translate
      .get("CALENDAR.FREQUENCIES")
      .subscribe((translations: any) => {
        this.frequencies = [
          { id: 6, name: translations.ONE_TIME },
          { id: 0, name: translations.DAILY },
          { id: 1, name: translations.WEEKLY },
          { id: 2, name: translations.MONTHLY },
          { id: 3, name: translations.QUARTERLY },
          { id: 4, name: translations.HALF_YEARLY },
          { id: 5, name: translations.YEARLY },
        ];
      });

    this.translate.get("CALENDAR.WEEK_DAYS").subscribe((translations: any) => {
      this.weekDays = [
        { id: 0, name: translations.SUNDAY },
        { id: 1, name: translations.MONDAY },
        { id: 2, name: translations.TUESDAY },
        { id: 3, name: translations.WEDNESDAY },
        { id: 4, name: translations.THURSDAY },
        { id: 5, name: translations.FRIDAY },
        { id: 6, name: translations.SATURDAY },
      ];
    });

    this.translate.get("CALENDAR.PRIORITY").subscribe((translations: any) => {
      this.colorsSelection = [
        { id: "urgent", name: translations.URGENT, category: colors.urgent },
        { id: "normal", name: translations.NORMAL, category: colors.normal },
        { id: "minor", name: translations.MINOR, category: colors.minor },
      ];
      if (
        this.formGroup &&
        this.modalMode === "add" &&
        !this.formGroup.get("category").value
      ) {
        this.formGroup.get("category").setValue("normal");
      }
    });
  }

  initFormGroup() {
    const now = new Date();
    const defaultStart = this.getTimeString(
      now.getHours(),
      now.getMinutes(),
    );
    const defaultEnd = this.getTimeString(
      now.getHours() + 1,
      now.getMinutes(),
    );

    this.formGroup = this.formBuilder.group({
      id: [""],
      title: ["", Validators.required],
      startDate: [startOfDay(this.selectedDate), Validators.required],
      endDate: [endOfDay(this.selectedDate), Validators.required],
      startTime: [defaultStart],
      endTime: [defaultEnd],
      category: ["normal", Validators.required],
      frequency: [6, Validators.required],
      dayOfWeek: [now.getDay(), Validators.required],
      documentId: [null],
      isEmailNotification: [false],
      description: [""],
      reminderUsers: [[]],
    });
  }

  getTimeString(hours: number, minutes: number): string {
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    hours = hours % 24;
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  private getStoredHours(dateValue: any): number {
    if (!dateValue) return 0;
    const dateStr = String(dateValue);
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):?(\d{2})?/);
    if (match) {
      return parseInt(match[4], 10);
    }
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? 0 : date.getUTCHours();
  }

  private getStoredMinutes(dateValue: any): number {
    if (!dateValue) return 0;
    const dateStr = String(dateValue);
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):?(\d{2})?/);
    if (match) {
      return parseInt(match[5], 10);
    }
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? 0 : date.getUTCMinutes();
  }

  private parseToLocalDate(utcDateString: string): Date {
    if (!utcDateString) {
      return new Date();
    }
    const dateStr = String(utcDateString).trim();
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):?(\d{2})?/);
    if (match) {
      const utcDate = Date.UTC(
        parseInt(match[1], 10),
        parseInt(match[2], 10) - 1,
        parseInt(match[3], 10),
        parseInt(match[4], 10),
        parseInt(match[5], 10),
        parseInt(match[6] || '0', 10)
      );
      return new Date(utcDate);
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  }

  private getDateOnly(date: Date): Date {
    return startOfDay(date);
  }

  private parsePlainDateTime(dateStr: string | null): Date {
    if (!dateStr) return new Date();
    const str = String(dateStr).trim();
    const isoStr = str.replace(' ', 'T');
    const date = new Date(isoStr + 'Z');
    return isNaN(date.getTime()) ? new Date() : date;
  }

  getReminders() {
    this.reminderService.getReminders(this.reminderResource).subscribe({
      next: (data: HttpResponse<any>) => {
        if (data && data.body) {
          this.events = [];
          data.body.forEach((el: any) => {
            const startDate = this.parsePlainDateTime(el.startDate);
            const endDate = el.endDate
              ? this.parsePlainDateTime(el.endDate)
              : startDate;

            this.events = [
              ...this.events,
              {
                id: el.id,
                title: el.subject,
                description: el.message,
                start: startDate,
                end: endDate,
                allDay: false,
                category:
                  colors[el.category] || el.category || colors.normal,
              },
            ];
          });
          this.updateSelectedDayEvents();
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error("Error fetching reminders:", err);
      },
    });
  }

  getDocuments() {
    const params = new DocumentResource();
    params.pageSize = 1000;
    this.documentService
      .getDocuments(params)
      .subscribe((data: HttpResponse<any>) => {
        this.documents = data.body || [];
      });
  }

  updateSelectedDayEvents() {
    this.selectedDayEvents = this.events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : eventStart;
      const dayStart = startOfDay(this.selectedDate);
      const dayEnd = endOfDay(this.selectedDate);
      return (eventStart <= dayEnd && eventEnd >= dayStart);
    });
  }

  ngAfterViewInit() {
    if (this.popovers) {
      this.popovers.forEach((popover: PopoverDirective) => {
        popover.onShown.subscribe(() => {
          this.popovers.filter((p) => p !== popover).forEach((p) => p.hide());
        });
      });
    }
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.viewDate = date;
    this.updateSelectedDayEvents();
    this.cdr.markForCheck();
  }

  onEventClicked(event: CalendarAppEvent): void {
    this.handleEvent("Clicked", event);
  }

  handleEvent(action: string, event: CalendarAppEvent): void {
    this.modalData = { event, action };
  }

  get isWeekly(): boolean {
    return this.formGroup?.get("frequency")?.value === 1;
  }

  get isRecurring(): boolean {
    const freq = this.formGroup?.get("frequency")?.value;
    return freq !== null && freq !== 6;
  }

  getUsers() {
    this.commonService
      .getUsersWithClaim("REMINDER_VIEW_REMINDERS")
      .subscribe((users: User[]) => (this.users = users));
  }

  isUserSelected(userId: string): boolean {
    const selected = this.formGroup.get("reminderUsers")?.value || [];
    return selected.includes(userId);
  }

  toggleUser(userId: string, event: any): void {
    const selected = [...(this.formGroup.get("reminderUsers")?.value || [])];
    const index = selected.indexOf(userId);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(userId);
    }
    this.formGroup.patchValue({ reminderUsers: selected });
    this.formGroup.markAsDirty();
  }

  get isTitleInvalid(): boolean {
    const ctrl = this.formGroup.get("title");
    return ctrl ? ctrl.invalid && (ctrl.dirty || this.isSubmitted) : false;
  }

  get isEndDateInvalid(): boolean {
    const startDate = this.formGroup?.get("startDate")?.value;
    const endDate = this.formGroup?.get("endDate")?.value;
    const startTime = this.formGroup?.get("startTime")?.value;
    const endTime = this.formGroup?.get("endTime")?.value;
    if (startDate && endDate) {
      const start = this.combineDateAndTime(startDate, startTime || "00:00");
      const end = this.combineDateAndTime(endDate, endTime || "00:00");
      return end < start;
    }
    return false;
  }

  get hasFormChanged(): boolean {
    if (this.modalMode === "add") {
      return true;
    }
    return this.formGroup.dirty;
  }

  private combineDateAndTime(date: Date, time: any): string {
    let hours: number;
    let minutes: number;

    if (typeof time === "string") {
      const parts = time.split(":");
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      if (isNaN(hours) || isNaN(minutes)) {
        return "";
      }
    } else if (time instanceof Date) {
      hours = time.getHours();
      minutes = time.getMinutes();
    } else {
      hours = 9;
      minutes = 0;
    }

    if (isNaN(hours) || isNaN(minutes)) {
      return "";
    }

    const d = new Date(date);
    const localDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      hours,
      minutes,
      0,
      0,
    );
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hour = String(localDate.getHours()).padStart(2, '0');
    const minute = String(localDate.getMinutes()).padStart(2, '0');
    const second = String(localDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  private getCurrentUserId(): string | undefined {
    let userId = this.securityService.getUserDetail()?.user?.id;
    if (!userId) {
      try {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const parsed = JSON.parse(currentUser);
          userId = parsed.id;
        }
      } catch (e) {
        console.error("Error parsing currentUser from localStorage:", e);
      }
    }
    return userId;
  }

  private buildReminderPayload(data: any, userId: string | undefined): any {
    const startDateTime = this.combineDateAndTime(
      data.startDate,
      data.startTime,
    );
    const endDateTime = this.combineDateAndTime(data.endDate, data.endTime);

    const isRecurring = data.frequency !== 6;
    const isActive = data.isActive !== undefined ? data.isActive : true;

    let reminderUsers = data.reminderUsers;
    if (!reminderUsers || reminderUsers.length === 0) {
      if (userId) {
        reminderUsers = [userId];
      } else {
        reminderUsers = [];
      }
    }

    reminderUsers = reminderUsers
      .filter((u: any) => u !== undefined && u !== null)
      .map((u: any) => {
        return {
          reminderId: data.id,
          userId: u,
        };
      });

    const reminderDate = new Date(data.startDate);

    return {
      dailyReminders:
        isRecurring && data.frequency === 1
          ? [{ dayOfWeek: data.dayOfWeek, isActive: true }]
          : [],
      dayOfWeek: data.dayOfWeek,
      frequency: data.frequency,
      frequencyId: String(data.frequency),
      halfYearlyReminders:
        isRecurring && data.frequency === 4
          ? [
              {
                day: new Date(data.startDate).getDate(),
                month: String(new Date(data.startDate).getMonth() + 1).padStart(
                  2,
                  "0",
                ),
                quarter: Math.floor(
                  (new Date(data.startDate).getMonth() + 3) / 3,
                ),
              },
            ]
          : [],
      quarterlyReminders:
        isRecurring && data.frequency === 3
          ? [
              {
                day: new Date(data.startDate).getDate(),
                month: String(new Date(data.startDate).getMonth() + 1).padStart(
                  2,
                  "0",
                ),
                quarter: Math.floor(
                  (new Date(data.startDate).getMonth() + 3) / 3,
                ),
              },
            ]
          : [],
      isEmailNotification: data.isEmailNotification || false,
      isActive: isActive,
      isRepeated: isRecurring,
      category: data.category,
      id: data.id,
      subject: data.title,
      description: data.description,
      startDate: startDateTime,
      endDate: endDateTime,
      reminderDate: reminderDate,
      reminderUsers: reminderUsers,
    };
  }

  addEvent(): void {
    this.isSubmitted = true;

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const data = this.formGroup.value;

    const startTimeValue = data.startTime;
    const endTimeValue = data.endTime;

    const startDateTime = this.combineDateAndTime(data.startDate, startTimeValue);
    const endDateTime = this.combineDateAndTime(data.endDate, endTimeValue);

    if (!startDateTime || isNaN(Date.parse(startDateTime))) {
      this.formGroup.get('startTime')?.setErrors({ invalid: true });
      return;
    }

    if (!endDateTime || isNaN(Date.parse(endDateTime))) {
      this.formGroup.get('endTime')?.setErrors({ invalid: true });
      return;
    }

    if (this.isEndDateInvalid) {
      this.formGroup.get('endDate')?.setErrors({ invalid: true });
      return;
    }

    const userId = this.getCurrentUserId();
    const formData = this.buildReminderPayload(data, userId);

    this.isLoading = true;
    this.reminderService.addReminder(formData).subscribe({
      next: () => {
        this.translate
          .get("CALENDAR.TOAST.EVENT_CREATED")
          .subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
        this.modalRef.hide();
        this.resetForm();
        this.getReminders();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error creating reminder:", err);
        this.isLoading = false;
        this.translate
          .get("CALENDAR.TOAST.ERROR_CREATED")
          .subscribe((translatedMessage: string) => {
            this.toastrService.error(translatedMessage);
          });
      },
    });
  }

  editEvent(): void {
    this.isSubmitted = true;

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const data = this.formGroup.value;

    const startTimeValue = data.startTime;
    const endTimeValue = data.endTime;

    const startDateTime = this.combineDateAndTime(data.startDate, startTimeValue);
    const endDateTime = this.combineDateAndTime(data.endDate, endTimeValue);

    if (!startDateTime || isNaN(Date.parse(startDateTime))) {
      this.formGroup.get('startTime')?.setErrors({ invalid: true });
      return;
    }

    if (!endDateTime || isNaN(Date.parse(endDateTime))) {
      this.formGroup.get('endTime')?.setErrors({ invalid: true });
      return;
    }

    if (this.isEndDateInvalid) {
      this.formGroup.get('endDate')?.setErrors({ invalid: true });
      return;
    }

    const userId = this.getCurrentUserId();
    const formData = this.buildReminderPayload(data, userId);

    this.isLoading = true;
    this.reminderService.updateReminder(formData).subscribe({
      next: () => {
        this.translate
          .get("CALENDAR.TOAST.EVENT_UPDATED")
          .subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
        this.modalRef.hide();
        this.resetForm();
        this.getReminders();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.translate
          .get("CALENDAR.TOAST.ERROR_UPDATED")
          .subscribe((translatedMessage: string) => {
            this.toastrService.error(translatedMessage);
          });
      },
    });
  }

  deleteEvent(id: string | number | any) {
    this.confirmingDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(id: string | number | any): void {
    this.reminderService.deleteReminder(id).subscribe({
      next: () => {
        this.translate
          .get("CALENDAR.TOAST.EVENT_DELETED")
          .subscribe((translatedMessage: string) => {
            this.toastrService.success(translatedMessage);
          });
        this.getReminders();
        this.confirmingDeleteId = null;
      },
      error: () => {
        this.confirmingDeleteId = null;
        this.translate
          .get("CALENDAR.TOAST.ERROR_DELETED")
          .subscribe((translatedMessage: string) => {
            this.toastrService.error(translatedMessage);
          });
      },
    });
  }

  resetForm() {
    this.modalMode = "add";
    this.isSubmitted = false;
    this.formGroup.reset();
    const now = new Date();
    const defaultStart = this.getTimeString(
      now.getHours(),
      now.getMinutes() + 30,
    );
    const defaultEnd = this.getTimeString(
      now.getHours() + 1,
      now.getMinutes() + 30,
    );

    this.formGroup.setValue({
      id: "",
      title: "",
      startDate: startOfDay(this.selectedDate),
      endDate: endOfDay(this.selectedDate),
      startTime: defaultStart,
      endTime: defaultEnd,
      category: "normal",
      frequency: 6,
      dayOfWeek: now.getDay(),
      documentId: null,
      isEmailNotification: false,
      description: "",
      reminderUsers: [],
    });
  }

  openEditEventModal(template: TemplateRef<any>, id: string | number | any) {
    this.commonService.getReminder(id).subscribe((data: any) => {
      this.modalMode = "edit";
      this.modalRef = this.modalService.show(template, {
        class: "modal-md modal-dialog-centered",
        backdrop: "static",
      });

      const startDate = this.parsePlainDateTime(data.startDate);
      const endDate = data.endDate ? this.parsePlainDateTime(data.endDate) : null;

      const startTime =
        data.startDate
          ? this.getTimeString(startDate.getUTCHours(), startDate.getUTCMinutes())
          : this.getTimeString(
              new Date().getUTCHours(),
              new Date().getUTCMinutes() + 30,
            );

      const endTime =
        data.endDate && endDate
          ? this.getTimeString(endDate.getUTCHours(), endDate.getUTCMinutes())
          : this.getTimeString(
              new Date().getUTCHours() + 1,
              new Date().getUTCMinutes() + 30,
            );

      this.formGroup.setValue({
        id: data.id,
        title: data.subject,
        startDate: this.getDateOnly(startDate),
        endDate: this.getDateOnly(endDate),
        startTime: startTime,
        endTime: endTime,
        category: data.category || "normal",
        frequency: data.frequencyId !== undefined && data.frequencyId !== null ? Number(data.frequencyId) : data.frequency,
        dayOfWeek:
          data.dayOfWeek != null ? data.dayOfWeek : startDate.getDay(),
        documentId: data.documentId || null,
        isEmailNotification: data.isEmailNotification || false,
        description: data.message,
        reminderUsers:
          data.reminderUsers && data.reminderUsers.length > 0
            ? data.reminderUsers.map((u: any) => u.userId)
            : [],
      });

      this.originalEventData = { ...data };
    });
  }

  openAddEventModal(template: TemplateRef<any>) {
    this.modalMode = "add";
    this.resetForm();
    this.modalRef = this.modalService.show(template, {
      class: "modal-md modal-dialog-centered",
      backdrop: "static",
    });
  }

  onModalClose() {
    if (this.modalSubscriptions) {
      this.modalSubscriptions.unsubscribe();
    }
    this.modalSubscriptions = combineLatest(
      this.modalRef.onHide,
      this.modalRef.onHidden,
    ).subscribe(() => {
      this.cdr.markForCheck();
      this.resetForm();
    });
  }

  ngOnDestroy(): void {
    if (this.modalSubscriptions) {
      this.modalSubscriptions.unsubscribe();
    }
  }
}
