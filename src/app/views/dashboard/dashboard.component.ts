import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ChartComponent,
} from "ng-apexcharts";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { DocumentService } from "@app/shared/services/document.service";
import { DocumentResource } from "@app/shared/enums/document-resource";
import { CommonService } from "@app/shared/services/common.service";
import { DashboardService } from "@app/shared/services/dashboard.service";
import { CategoryService } from "@app/shared/services/category.service";
import { environment } from "src/environments/environment";
import { ArticleService } from "@app/shared/services/article.service";
import { TranslateService } from "@ngx-translate/core";
import { RtlService } from "@app/core/rtl.service";

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

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("donutChart") donutChart: ChartComponent;

  overviewData = {
    duration: [] as string[],
    income: [] as number[],
    expense: [] as number[],
  };

  deviceStatisticData: any;
  private _subscriptions: Subscription = new Subscription();

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  rows: any[] = [];
  selected: any[] = [];
  documentResource: DocumentResource;

  chartOptions: any;
  donutTotalLabel = "";

  articles: any[] = [];

  categoriesLoaded = false;
  devicesLoaded = false;
  newsLoaded = false;
  usersLoaded = false;
  overviewLoaded = false;

  private _isRtl = false;
  get isRtl(): boolean {
    return this._isRtl;
  }

  statCards: StatCard[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private articleService: ArticleService,
    private commonService: CommonService,
    private documentService: DocumentService,
    private dashboardService: DashboardService,
    private categoryService: CategoryService,
    private translate: TranslateService,
    private rtlService: RtlService,
  ) {
    this._isRtl = this.rtlService.isRtl;
    this.documentResource = new DocumentResource();
    this.chartOptions = this.getDonutChartOptions();

    this._subscriptions.add(
      this.rtlService.getIsRtl$().subscribe((isRtl) => {
        this._isRtl = isRtl;
      }),
    );
  }

  ngOnInit(): void {
    this.initStats();
    this.initDeviceStatisticData();
    this.getUsers();
    this.getArticles();
    this.categoriesDonut();
    this.documentTransaction();

    this._subscriptions.add(
      this.translate.stream("DASHBOARD.TOTAL").subscribe((label: string) => {
        if (this.chartOptions) {
          this.donutTotalLabel = label;
          this.chartOptions.plotOptions.pie.donut.labels.total.label = label;
          setTimeout(() => {
            if (this.donutChart) {
              this.donutChart.updateOptions({
                plotOptions: {
                  pie: {
                    donut: {
                      labels: { total: { label } },
                    },
                  },
                },
              });
            }
          });
        }
      }),
    );
  }

  private getDonutChartOptions(totalLabel?: string): any {
    const label =
      totalLabel ||
      this.donutTotalLabel ||
      this.translate.instant("DASHBOARD.TOTAL");

    return {
      series: [],
      chart: { type: "donut", height: 280, sparkline: { enabled: true } },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {},
            legend: { position: "bottom" },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              total: {
                show: true,
                label,
                color: "#92400e",
                fontFamily: "Cairo, Inter, sans-serif",
              },
            },
          },
        },
      },
      // Warm-toned donut palette that harmonises with the amber design system
      colors: [
        "#b45309", // amber
        "#0f6e56", // teal
        "#185fa5", // blue
        "#4c1d95", // purple
        "#065f46", // green
        "#9a3412", // deep amber
      ],
      legend: {
        position: "bottom",
        fontSize: "12px",
        labels: { colors: ["#92400e"] },
      },
    };
  }

  getHost(): string {
    return environment.apiUrl;
  }

  private initStats(): void {
    this.statCards = [
      {
        title: "DASHBOARD.STATS.USERS",
        value: "0",
        icon: "icon-users",
        color: "#b45309", // amber  — matches primary accent
      },
      {
        title: "DASHBOARD.STATS.ARTICLES",
        value: "0",
        icon: "icon-file-text",
        color: "#0f6e56", // teal
      },
      {
        title: "DASHBOARD.STATS.DOCUMENTS",
        value: "0",
        icon: "icon-folder",
        color: "#185fa5", // blue
      },
      {
        title: "DASHBOARD.STATS.CATEGORIES",
        value: "0",
        icon: "icon-tag",
        color: "#4c1d95", // purple
      },
    ];
  }

  getArticles(): void {
    this._subscriptions.add(
      this.articleService.allArticlesForDashboard({ limit: 4 }).subscribe({
        next: (data: any) => {
          this.articles = data;
          this.newsLoaded = true;
          this.updateStatCard(1, data.length);
          this.cdr.markForCheck();
        },
        error: () => {
          this.articles = [];
          this.newsLoaded = true;
          this.cdr.markForCheck();
        },
      }),
    );
  }

  private updateStatCard(index: number, value: number): void {
    if (this.statCards[index]) {
      this.statCards[index] = { ...this.statCards[index], value };
    }
  }

  documentTransaction(): void {
    const months: Record<string, string[]> = {
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

    this._subscriptions.add(
      this.documentService.documentTransaction().subscribe(
        (data: any) => {
          const duration: string[] = [];
          const expense: number[] = [];
          const income: number[] = [];

          data.sort((a: any, b: any) => a.month - b.month);

          data.forEach((item: any) => {
            const locale = this.translate.currentLang;
            const monthNames =
              months[locale] ||
              months[locale?.replace("-", "_")] ||
              months.en_US;
            duration.push(monthNames[item.month - 1]);
            expense.push(parseInt(item.downloadCount));
            income.push(parseInt(item.uploadCount));
          });

          this.overviewData = { duration, expense, income };
          this.overviewLoaded = true;
          this.cdr.detectChanges();
        },
        () => {
          this.overviewData = { duration: [], expense: [], income: [] };
          this.overviewLoaded = true;
          this.cdr.markForCheck();
        },
      ),
    );
  }

  categoriesDonut(): void {
    this._subscriptions.add(
      this.dashboardService.getDocumentByCategory().subscribe(
        (data) => {
          if (!data || data.length === 0) {
            this.chartOptions.series = [];
            this.chartOptions.labels = [];
          } else {
            const series: number[] = [];
            const labels: string[] = [];

            data.forEach((item: any) => {
              labels.push(item.categoryName);
              series.push(item.documentCount);
            });

            this.chartOptions.series = series;
            this.chartOptions.labels = labels;
            this.updateStatCard(
              2,
              series.reduce((a: number, b: number) => a + b, 0),
            );
          }

          this.categoryService.getAllCategoriesForDropDown().subscribe(
            (categories) => this.updateStatCard(3, categories.length),
          );

          this.categoriesLoaded = true;
          this.cdr.detectChanges();
        },
        () => {
          this.chartOptions.series = [];
          this.chartOptions.labels = [];
          this.categoriesLoaded = true;
          this.cdr.markForCheck();
        },
      ),
    );
  }

  getUsers(): void {
    this._subscriptions.add(
      this.commonService.getUsers().subscribe(
        (data: any) => {
          this.rows = data;
          this.usersLoaded = true;
          this.updateStatCard(0, data.length);
          this.cdr.detectChanges();
        },
        () => {
          this.usersLoaded = true;
          this.cdr.detectChanges();
        },
      ),
    );
  }

  initDeviceStatisticData(): void {
    this._subscriptions.add(
      this.documentService.getDocumentByExtension().subscribe(
        (data: any) => {
          // Backend returns { documents: [...], total_documents: N }
          // Map to expected format with 'count' and 'extension' fields
          this.deviceStatisticData = (data.documents || []).map((d: any) => ({
            extension: d.extension,
            count: d.total ?? d.count ?? 0,
          }));
          this.devicesLoaded = true;
          this.cdr.markForCheck();
        },
        () => {
          this.devicesLoaded = true;
          this.cdr.markForCheck();
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
