import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, switchMap, map } from "rxjs/operators";
import {
  COLOR_2,
  COLOR_3,
  ApexChartDefault,
  ApexBarDefault,
  ApexDataLabelDefault,
  COLOR_1,
  COLOR_4,
  COLOR_5,
} from "@app/configs/chart.config";
import { OverviewDataRating } from "@app/views/dashboard/dashboard.type";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  ApexGrid,
} from "ng-apexcharts";
import { SurveyService } from "../survey.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  colors?: string[];
};

@Component({
  selector: "app-survey-detail",
  templateUrl: "./survey-detail.component.html",
  styleUrls: ["./survey-detail.component.scss"],
  host: {
    "[class.card]": "true",
  },
})
export class SurveyDetailComponent implements OnInit, OnDestroy {
  @ViewChild("overviewChart") chart: ChartComponent;
  public overviewChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: { type: "bar" },
    dataLabels: {},
    plotOptions: {},
    yaxis: {},
    xaxis: {},
    fill: {},
    tooltip: {},
    stroke: {},
    legend: {},
  };

  overviewData: OverviewDataRating;
  survey: any;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private surveyService: SurveyService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getSurveyDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSurveyDetails() {
    this.activeRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get("id")),
        switchMap((id) => this.surveyService.getSurvey(id)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (data: any) => {
          this.survey = data;
          this.survey.answersCount = data.answersCount ?? data.answers_count ?? 0;
          this.isLoading = false;
          this.getStatistics();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(
            this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR")
          );
          this.cdr.markForCheck();
        },
      });
  }

  getStatistics() {
    if (!this.survey?.id) return;

    this.surveyService
      .getStatistics(this.survey.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
        const months = {
          fr_FR: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          ar_AR: [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر",
          ],
          en_US: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        };

        const normalizeLang = (lang: string): string => {
          if (!lang) return "en_US";
          const normalized = lang.replace(/-/g, "_");
          const langMap: { [key: string]: string } = {
            en: "en_US",
            fr: "fr_FR",
            ar: "ar_AR",
          };
          return (
            langMap[normalized.substring(0, 2)] ||
            (months[normalized] ? normalized : "en_US")
          );
        };

        let type: string = "";
        const duration: string[] = [];
        const zero: number[] = [];
        const one: number[] = [];
        const two: number[] = [];
        const three: number[] = [];
        const four: number[] = [];
        const five: number[] = [];

        const safeLang = normalizeLang(this.translate.currentLang);
        const monthLabels = months[safeLang] || months["en_US"];

        const monthMap = new Map<
          number,
          {
            zero: number;
            one: number;
            two: number;
            three: number;
            four: number;
            five: number;
          }
        >();

        data.forEach((item) => {
          const month = item.month;
          if (!monthMap.has(month)) {
            monthMap.set(month, {
              zero: 0,
              one: 0,
              two: 0,
              three: 0,
              four: 0,
              five: 0,
            });
          }
          const entry = monthMap.get(month)!;

          type = item.type;
          if (item.type == "simple") {
            if (parseInt(item.answer) == 0)
              entry.zero = (entry.zero || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 1)
              entry.one = (entry.one || 0) + parseInt(item.count);
          }
          if (item.type == "rating") {
            if (parseInt(item.answer) == 1)
              entry.one = (entry.one || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 2)
              entry.two = (entry.two || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 3)
              entry.three = (entry.three || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 4)
              entry.four = (entry.four || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 5)
              entry.five = (entry.five || 0) + parseInt(item.count);
          }
          if (item.type == "satisfaction") {
            if (parseInt(item.answer) == 0)
              entry.zero = (entry.zero || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 1)
              entry.one = (entry.one || 0) + parseInt(item.count);
            if (parseInt(item.answer) == 2)
              entry.two = (entry.two || 0) + parseInt(item.count);
          }
        });

        const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => a - b);
        sortedMonths.forEach((month) => {
          const entry = monthMap.get(month)!;
          duration.push(monthLabels[month - 1] || "");
          zero.push(entry.zero);
          one.push(entry.one);
          two.push(entry.two);
          three.push(entry.three);
          four.push(entry.four);
          five.push(entry.five);
        });

        this.overviewData = {
          duration: duration,
          zero: zero,
          one: one,
          two: two,
          three: three,
          four: four,
          five: five,
        };

        this.translate
          .get("SURVEY.CHART")
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessage: any) => {
            const safeType = type || "simple";
            const typeKey = safeType.toUpperCase();
            const defaults: Record<string, Record<string, string>> = {
              SIMPLE: { ZERO_STARS: "0 Stars", ONE_STARS: "1 Star" },
              RATING: { ONE_STARS: "1 Star", TWO_STARS: "2 Stars", THREE_STARS: "3 Stars", FOUR_STARS: "4 Stars", FIVE_STARS: "5 Stars" },
              SATISFACTION: { ZERO_STARS: "Unsatisfied", ONE_STARS: "Neutral", TWO_STARS: "Satisfied" }
            };
            const getLabel = (key: string) => translatedMessage?.[typeKey]?.[key] || defaults[safeType]?.[key] || key;
            this.overviewChartOptions = {
              series:
                safeType == "simple"
                  ? [
                      {
                        name: getLabel("ZERO_STARS"),
                        data: this.overviewData.zero,
                        color: COLOR_1,
                      },
                      {
                        name: getLabel("ONE_STARS"),
                        data: this.overviewData.one,
                        color: COLOR_2,
                      },
                    ]
                  : safeType == "rating"
                    ? [
                        {
                          name: getLabel("ONE_STARS"),
                          data: this.overviewData.one,
                          color: COLOR_4,
                        },
                        {
                          name: getLabel("TWO_STARS"),
                          data: this.overviewData.two,
                          color: COLOR_5,
                        },
                        {
                          name: getLabel("THREE_STARS"),
                          data: this.overviewData.three,
                          color: COLOR_3,
                        },
                        {
                          name: getLabel("FOUR_STARS"),
                          data: this.overviewData.four,
                          color: COLOR_1,
                        },
                        {
                          name: getLabel("FIVE_STARS"),
                          data: this.overviewData.five,
                          color: COLOR_2,
                        },
                      ]
                    : [
                        {
                          name: getLabel("ZERO_STARS"),
                          data: this.overviewData.zero,
                          color: COLOR_5,
                        },
                        {
                          name: getLabel("ONE_STARS"),
                          data: this.overviewData.one,
                          color: COLOR_3,
                        },
                        {
                          name: getLabel("TWO_STARS"),
                          data: this.overviewData.two,
                          color: COLOR_2,
                        },
                      ],
              chart: {
                ...ApexChartDefault,
                type: "bar",
                height: 380,
                foreColor: "#64748b",
                background: "transparent",
                toolbar: {
                  show: false,
                },
                sparkline: {
                  enabled: false,
                },
                animations: {
                  enabled: true,
                  speed: 800,
                  animateGradually: {
                    enabled: true,
                    delay: 150,
                  },
                },
                fontFamily: "Cairo, Inter, sans-serif",
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  distributed: false,
                  barHeight: "70%",
                  borderRadius: 4,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              colors: [COLOR_1, COLOR_4, COLOR_3, COLOR_2, COLOR_5],
              dataLabels: {
                enabled: true,
                formatter: function (val: number) {
                  return val > 0 ? val.toString() : "";
                },
                textAnchor: "middle",
                offsetY: -8,
                style: {
                  fontSize: "12px",
                  fontWeight: 600,
                  colors: ["#fff"],
                },
                dropShadow: {
                  enabled: false,
                },
              },
              stroke: {
                show: true,
                width: 1,
                colors: ["#fff"],
                lineCap: "round",
                curve: "smooth",
              },
              grid: {
                show: true,
                borderColor: "#e2e8f0",
                strokeDashArray: 4,
                xaxis: {
                  lines: {
                    show: false,
                  },
                },
                yaxis: {
                  lines: {
                    show: true,
                  },
                },
                padding: {
                  top: 0,
                  right: 8,
                  bottom: 0,
                  left: 8,
                },
              },
              xaxis: {
                categories: this.overviewData.duration,
                axisBorder: {
                  show: true,
                  color: "#e2e8f0",
                  offsetX: 0,
                  offsetY: 0,
                },
                axisTicks: {
                  show: false,
                },
                labels: {
                  style: {
                    colors: "#64748b",
                    fontSize: "11px",
                    fontFamily: "Cairo, Inter, sans-serif",
                    fontWeight: 500,
                  },
                },
              },
              yaxis: {
                title: {
                  text: "",
                  style: {
                    color: "#64748b",
                    fontSize: "12px",
                    fontFamily: "Cairo, Inter, sans-serif",
                    fontWeight: 500,
                  },
                },
                labels: {
                  style: {
                    colors: "#64748b",
                    fontSize: "11px",
                    fontFamily: "Cairo, Inter, sans-serif",
                  },
                  formatter: function (val: number) {
                    return Math.round(val).toString();
                  },
                },
              },
              fill: {
                opacity: 0.95,
                type: "solid",
              },
              tooltip: {
                theme: "light",
                shared: true,
                intersect: false,
                x: {
                  show: true,
                },
                y: {
                  formatter: function (val: number) {
                    return val.toString();
                  },
                  title: {
                    formatter: function () {
                      return "";
                    },
                  },
                },
                marker: {
                  show: true,
                },
              },
              legend: {
                show: true,
                position: "top",
                horizontalAlign: "center",
                floating: false,
                offsetY: 16,
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "Cairo, Inter, sans-serif",
                labels: {
                  colors: "#64748b",
                  useSeriesColors: false,
                },
                markers: {
                  radius: 3,
                  offsetX: 0,
                  offsetY: 2,
                },
                itemMargin: {
                  horizontal: 12,
                  vertical: 8,
                },
              },
            };
          });

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Error loading statistics:", err);
        this.toastr.error(
          this.translate.instant("ADD.SHARED.ERRORS.NETWORK_ERROR")
        );
        this.cdr.markForCheck();
      },
    });
  }
}
