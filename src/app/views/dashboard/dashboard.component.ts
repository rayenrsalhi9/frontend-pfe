import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';
import {
  RegionData,
  OverviewData,
  RecentTransactionData,
  RecentReviewData,
  DeviceStatisticData,
  CountriesData,
  DeviceStatistic
} from './dashboard.type';
import {
  ApexBarDefault,
  ApexChartDefault,
  ApexDataLabelDefault,
  COLOR_1,
  COLOR_2,
  COLOR_3,
  COLOR_4
} from '@app/configs/chart.config';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from 'ng-apexcharts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { DocumentService } from '@app/shared/services/document.service';
import { DocumentResource } from '@app/shared/enums/document-resource';
import { HttpResponse } from '@angular/common/http';
import { CommonError } from '@app/core/error-handler/common-error';
import { CommonService } from '@app/shared/services/common.service';
import { DashboradService } from './dashboards.service';
import { environment } from 'src/environments/environment';
import { ArticleService } from '@app/shared/services/article.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ArticlesViewsComponent } from '../apps/articles/articles-views/articles-views.component';
import { TranslateService } from '@ngx-translate/core';

const colors = [COLOR_1, COLOR_2, COLOR_3, COLOR_4]

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
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  @ViewChild('monthly-revenue-chart') chart: ChartComponent;
  monthlyRevenueChart: Partial<ChartOptions>;
  regionMapData: RegionData[]
  overviewData: OverviewData = {
    duration: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income: [0],
    expense: [0],
    sum: []
  }
  recentTransactionData: RecentTransactionData[]
  recentReviewData: RecentReviewData[]
  deviceStatisticData: DeviceStatistic
  countriesData: CountriesData[]
  private _subscriptions: Subscription[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rows: any[] = [];
  selected = [];
  documentResource: DocumentResource;
  subscription: Subscription
  chartOptions: any
  articles:any[]

  constructor(
    private dashboardSvc: DashboardService,
    private cdr: ChangeDetectorRef,
    private articleService:ArticleService,
    private commonService: CommonService,
    private documentService: DocumentService,
    private dashboardService: DashboradService,
    private modalService: BsModalService,
    private translate: TranslateService
  ) {
    this.documentResource = new DocumentResource();
    this.chartOptions = {
      series: [0],
      chart: {
        type: "donut"
      },
      labels: [0],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  getHost() {
    return environment.apiUrl
  }

  ngOnInit(): void {
    this.initDeviceStatisticData()
    this.getUsers()
    this.getArticles()
    this.categoriesDonut()
    this.documentTransaction()
  }

  getArticles() {
    this.articleService.allArticles({limit:4}).subscribe(
      (data:any)=>{
        this.articles = data
        this.cdr.markForCheck()
      }
    )
    this.cdr.detectChanges()
  }

  viewArticle(data:any) {
    const initialState = {
      data: Object.assign({}, data),
    };
    this.modalService.show(ArticlesViewsComponent,{initialState:initialState})
  }

  documentTransaction() {

    const months = {
      'fr_FR': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'novembre', 'Décembre'],
      'ar_AR': ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
      'en_US': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    }

    this.documentService.documentTransaction().subscribe(
      (data: any) => {

        let duration = [];
        let expense = [];
        let income = [];

        data.sort((a, b) => a.month - b.month);

        data.forEach(item => {
          duration.push(months[this.translate.currentLang][item.month - 1]);
          expense.push(parseInt(item.downloadCount));
          income.push(parseInt(item.uploadCount));
        });

        this.overviewData = {
          duration: duration,
          expense: expense,
          income: income
        }


        this.cdr.detectChanges()

      }
    )
  }

  categoriesDonut() {
    this.dashboardService.getDocumentByCategory().subscribe(data => {

      const series = [];
      const labels = [];

      data.forEach(item => {
        labels.push(item.categoryName);
        series.push(item.documentCount);
      });

      this.chartOptions = {
        series: series,
        chart: {
          type: "donut"
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };

      this.cdr.markForCheck()
      this.cdr.detectChanges()
    });
  }

  getUsers(): void {
    this.commonService.getUsers().subscribe(
      (data: any) => {
        this.rows = data;
        this.cdr.detectChanges();
      },
      (err: CommonError) => {
        err.messages.forEach((msg) => {
          this.cdr.detectChanges();
        });
      }
    );
  }

  initRecentTransactionData() {
    return this.dashboardSvc.getRecentTransactionData().subscribe(res => {
      this.recentTransactionData = res
      this.cdr.markForCheck();
    })
  }

  initDeviceStatisticData() {

    this.documentService.getDocumentByExtension().subscribe(
      (data: any) => {
        this.deviceStatisticData = data
        this.cdr.markForCheck();
      }
    )

  }

  ngOnDestroy() {
    this._subscriptions.forEach(elm => {
      elm.unsubscribe()
    })
  }
}
