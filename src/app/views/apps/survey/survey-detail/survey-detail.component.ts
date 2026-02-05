import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { COLOR_2, COLOR_3, ApexChartDefault, ApexBarDefault, ApexDataLabelDefault, COLOR_1, COLOR_4, COLOR_5 } from '@app/configs/chart.config';
import { OverviewData, OverviewDataRating } from '@app/views/dashboard/dashboard.type';
import { DashboradService } from '@app/views/dashboard/dashboards.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { SurveyService } from '../survey.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: [],
  host: {
    '[class.card]': 'true'
  }
})
export class SurveyDetailComponent implements OnInit {

  @ViewChild('overviewChart') chart: ChartComponent;
  public overviewChartOptions: Partial<ChartOptions>;

  overviewData: OverviewDataRating

  constructor(
    private cdr: ChangeDetectorRef,
    private surveyService: SurveyService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.getSuvey()
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  getSuvey() {

    this.activeRoute.paramMap.subscribe(async params => {
      let id = params.get('id')

      const months = {
        'fr_FR': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'novembre', 'Décembre'],
        'ar_AR': ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        'en_US': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      }

      this.surveyService.getStatistics(id).subscribe(
        (data: any) => {

          let type: string = null;
          let duration = [];
          let zero = [];
          let one = [];
          let two = [];
          let three = [];
          let four = [];
          let five = [];

          data.sort((a, b) => a.month - b.month);

          console.log(this.translate.currentLang);


          data.forEach(item => {

            duration.push(months[this.translate.currentLang][item.month - 1]);

            type = item.type
            if (item.type == 'simple') {
              if (parseInt(item.answer) == 0) zero.push(parseInt(item.count));
              if (parseInt(item.answer) == 1) one.push(parseInt(item.count));
            }
            if (item.type == 'rating') {
              if (parseInt(item.answer) == 1) one.push(parseInt(item.count));
              if (parseInt(item.answer) == 2) two.push(parseInt(item.count));
              if (parseInt(item.answer) == 3) three.push(parseInt(item.count));
              if (parseInt(item.answer) == 4) four.push(parseInt(item.count));
              if (parseInt(item.answer) == 5) five.push(parseInt(item.count));
            }
            if (item.type == 'satisfaction') {
              if (parseInt(item.answer) == 0) zero.push(parseInt(item.count));
              if (parseInt(item.answer) == 1) one.push(parseInt(item.count));
              if (parseInt(item.answer) == 2) two.push(parseInt(item.count));
            }
          });

          this.overviewData = {
            duration: duration,
            zero: zero,
            one: one,
            two: two,
            three: three,
            four: four,
            five: five
          }

          this.translate.get('SURVEY.CHART').subscribe((translatedMessage: string) => {

            this.overviewChartOptions = {
              series: type == "simple" ? [
                {
                  name: translatedMessage[type.toUpperCase()].ZERO_STARS,
                  data: this.overviewData.one,
                  color: COLOR_1
                },
                {
                  name: translatedMessage[type.toUpperCase()].ONE_STARS,
                  data: this.overviewData.zero,
                  color: COLOR_2
                }
              ] : type == "rating" ? [
                {
                  name: translatedMessage[type.toUpperCase()].ONE_STARS,
                  data: this.overviewData.one,
                  color: COLOR_4
                },
                {
                  name: translatedMessage[type.toUpperCase()].TWO_STARS,
                  data: this.overviewData.two,
                  color: COLOR_5
                },
                {
                  name: translatedMessage[type.toUpperCase()].THREE_STARS,
                  data: this.overviewData.three,
                  color: COLOR_3
                },
                {
                  name: translatedMessage[type.toUpperCase()].FOUR_STARS,
                  data: this.overviewData.four,
                  color: COLOR_1
                },
                {
                  name: translatedMessage[type.toUpperCase()].FIVE_STARS,
                  data: this.overviewData.five,
                  color: COLOR_2
                }
              ] : [
                {
                  name: translatedMessage[type.toUpperCase()].ZERO_STARS,
                  data: this.overviewData.zero,
                  color: COLOR_5
                },
                {
                  name: translatedMessage[type.toUpperCase()].ONE_STARS,
                  data: this.overviewData.one,
                  color: COLOR_3
                },
                {
                  name: translatedMessage[type.toUpperCase()].TWO_STARS,
                  data: this.overviewData.two,
                  color: COLOR_2
                }
              ],
              chart: {
                ...ApexChartDefault,
                type: "bar",
                height: 350
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
                  }
                }
              }
            }

          });


          this.cdr.markForCheck()

        }
      )

      this.cdr.detectChanges()

    })

  }

  /* initChart(rss = null) {
    this.overviewChartOptions = {
      series: [
        {
          name: this.serieUpload,
          data: [],
          color: COLOR_2
        },
        {
          name: this.serieDownload,
          data: [],
          color: COLOR_3
        }
      ],
      chart: {
        ...ApexChartDefault,
        type: "bar",
        height: 350
      },
      plotOptions: ApexBarDefault,
      dataLabels: ApexDataLabelDefault,
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
        ]
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "" + val + " Documents";
          }
        }
      }
    };

    if (this.overviewData) {

      this.overviewChartOptions.series[0].data = this.overviewData.income
      this.overviewChartOptions.series[1].data = this.overviewData.expense
      this.overviewChartOptions.xaxis.categories = this.overviewData.duration

      if (localStorage.getItem('lang') === 'en_US') {
        this.serieUpload = 'Upload';
        this.serieDownload = 'Download';
      } else if (localStorage.getItem('lang') === 'fr_FR') {
        this.serieUpload = 'Déposer';
        this.serieDownload = 'Télécharger';
      } else if (localStorage.getItem('lang') === 'ar_AR') {
        this.serieUpload = 'تحميل';
        this.serieDownload = 'تنزيل';
      }
      this.cdr.markForCheck()
    }
  } */
}
