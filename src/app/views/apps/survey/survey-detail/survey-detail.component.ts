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
} from "ng-apexcharts";
import { SurveyService } from "../survey.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

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
};

@Component({
  selector: "app-survey-detail",
  templateUrl: "./survey-detail.component.html",
  styleUrls: [],
  host: {
    "[class.card]": "true",
  },
})
export class SurveyDetailComponent implements OnInit, OnDestroy {
  @ViewChild("overviewChart") chart: ChartComponent;
  public overviewChartOptions: Partial<ChartOptions>;

  overviewData: OverviewDataRating;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private surveyService: SurveyService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getSurvey();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSurvey() {
    this.activeRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get("id")),
        switchMap((id) => this.surveyService.getStatistics(id)),
        takeUntil(this.destroy$),
      )
      .subscribe((data: any) => {
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

        data.sort((a, b) => a.month - b.month);

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
          .subscribe((translatedMessage: string) => {
            const safeType = type || "simple";
            this.overviewChartOptions = {
              series:
                safeType == "simple"
                  ? [
                      {
                        name: translatedMessage[safeType.toUpperCase()]
                          .ZERO_STARS,
                        data: this.overviewData.zero,
                        color: COLOR_1,
                      },
                      {
                        name: translatedMessage[safeType.toUpperCase()]
                          .ONE_STARS,
                        data: this.overviewData.one,
                        color: COLOR_2,
                      },
                    ]
                  : safeType == "rating"
                    ? [
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .ONE_STARS,
                          data: this.overviewData.one,
                          color: COLOR_4,
                        },
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .TWO_STARS,
                          data: this.overviewData.two,
                          color: COLOR_5,
                        },
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .THREE_STARS,
                          data: this.overviewData.three,
                          color: COLOR_3,
                        },
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .FOUR_STARS,
                          data: this.overviewData.four,
                          color: COLOR_1,
                        },
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .FIVE_STARS,
                          data: this.overviewData.five,
                          color: COLOR_2,
                        },
                      ]
                    : [
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .ZERO_STARS,
                          data: this.overviewData.zero,
                          color: COLOR_5,
                        },
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .ONE_STARS,
                          data: this.overviewData.one,
                          color: COLOR_3,
                        },
                        {
                          name: translatedMessage[safeType.toUpperCase()]
                            .TWO_STARS,
                          data: this.overviewData.two,
                          color: COLOR_2,
                        },
                      ],
              chart: {
                ...ApexChartDefault,
                type: "bar",
                height: 350,
              },
              plotOptions: ApexBarDefault,
              dataLabels: ApexDataLabelDefault,
              stroke: { show: true, width: 2, colors: ["transparent"] },
              xaxis: { categories: this.overviewData.duration },
              yaxis: { title: { text: "" } },
              fill: { opacity: 1 },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return "" + val + "";
                  },
                },
              },
            };
          });

        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
  }
}
