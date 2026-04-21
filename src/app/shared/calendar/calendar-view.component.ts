import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  format,
} from "date-fns";
import { arSA, fr, enUS } from "date-fns/locale";

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: any[];
}

interface CalendarEvent {
  id: any;
  title: string;
  start: Date;
  end?: Date;
  color?: {
    primary: string;
    secondary?: string;
  };
  category?: string | { primary: string; secondary?: string };
  description?: string;
  allDay?: boolean;
  draggable?: boolean;
  cssClass?: string;
}

@Component({
  selector: "app-calendar-view",
  templateUrl: "./calendar-view.component.html",
  styleUrls: ["./calendar-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Input() locale: "en" | "ar" | "fr" = "en";

  @Output() dateSelected = new EventEmitter<Date>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  viewDate: Date = new Date();
  today: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = [];
  currentMonthYear: string = "";

  private supportedLocales = ["en", "ar", "fr"];
  private safeLocale: "en" | "ar" | "fr" = "en";

  private locales: any = {
    en: enUS,
    ar: arSA,
    fr: fr,
  };

  private weekDaysMap: any = {
    en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  };

  private normalizeLocale(locale: string): "en" | "ar" | "fr" {
    if (this.supportedLocales.includes(locale)) {
      return locale as "en" | "ar" | "fr";
    }
    return "en";
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.safeLocale = this.normalizeLocale(this.locale);
    this.viewDate = new Date(this.selectedDate);
    this.weekDays = this.weekDaysMap[this.safeLocale] || this.weekDaysMap.en;
    this.generateCalendar();
    this.updateMonthYear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedDate"] && !changes["selectedDate"].firstChange) {
      this.viewDate = new Date(this.selectedDate);
      this.generateCalendar();
      this.updateMonthYear();
    }
    if (changes["events"]) {
      this.generateCalendar();
    }
    if (changes["locale"] && !changes["locale"].firstChange) {
      this.safeLocale = this.normalizeLocale(this.locale);
      this.weekDays = this.weekDaysMap[this.safeLocale] || this.weekDaysMap.en;
      this.updateMonthYear();
      this.cdr.markForCheck();
    }
  }

  generateCalendar(): void {
    const monthStart = startOfMonth(this.viewDate);
    const monthEnd = endOfMonth(this.viewDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    this.today = new Date();

    this.calendarDays = days.map((date) => ({
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: isSameMonth(date, this.viewDate),
      isToday: isSameDay(date, this.today),
      isSelected: isSameDay(date, this.selectedDate),
      events: this.getEventsForDate(date),
    }));

    this.cdr.markForCheck();
  }

  updateMonthYear(): void {
    const localeObj = this.locales[this.safeLocale] || this.locales.en;
    this.currentMonthYear = format(this.viewDate, "MMMM yyyy", {
      locale: localeObj,
    });
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : eventStart;
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.generateCalendar();
    this.updateMonthYear();
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.generateCalendar();
    this.updateMonthYear();
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.selectDate(new Date());
  }

  selectDate(date: Date): void {
    this.dateSelected.emit(date);
  }

  onEventClick(event: CalendarEvent, $event: MouseEvent): void {
    $event.stopPropagation();
    this.eventClicked.emit(event);
  }

  addDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  getEventColor(event: CalendarEvent): string {
    if (event.color?.primary) {
      return event.color.primary;
    }

    if (typeof event.category === "string") {
      return event.category;
    }

    if (event.category && typeof event.category === "object") {
      return event.category.primary ?? event.category.secondary ?? "#2563eb";
    }

    return "#2563eb";
  }

  trackByDate(index: number, day: CalendarDay): number {
    return day.date.getTime();
  }

  trackByEvent(index: number, event: CalendarEvent): any {
    return event.id;
  }

  formatDateLocale(date: Date): string {
    return new Intl.DateTimeFormat(this.safeLocale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }
}
