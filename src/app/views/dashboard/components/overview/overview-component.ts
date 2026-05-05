import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { RtlService } from "@app/core/rtl.service";
import { OverviewData } from "../../dashboard.type";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexLegend,
  ApexGrid,
} from "ng-apexcharts";

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
  selector: "overview",
  templateUrl: "./overview-component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("overviewChart") chart: ChartComponent;
  public overviewChartOptions: Partial<ChartOptions>;

  private readonly destroy$ = new Subject<void>();

  @Input() data: OverviewData;

  uploadLabel = "Uploads";
  downloadLabel = "Downloads";
  tooltipText = "Documents";

  // Warm palette: amber for uploads, teal for downloads
  private colors = {
    primary: "#b45309", // amber  — matches dashboard accent
    secondary: "#0f6e56", // teal
  };

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private rtlService: RtlService,
  ) {
    this.initChartOptions();

    this.rtlService
      .getIsRtl$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRtl) => {
        if (this.overviewChartOptions) {
          this.overviewChartOptions = {
            ...this.overviewChartOptions,
            yaxis: {
              ...this.overviewChartOptions.yaxis,
              opposite: isRtl,
            },
          };
          this.cdr.markForCheck();
        }
      });
  }

  ngOnInit(): void {
    this.translateLabels();
  }

  private translateLabels(): void {
    this.translate
      .stream(["DASHBOARD.UPLOAD", "DASHBOARD.DOWNLOAD", "DASHBOARD.DOCUMENTS"])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.uploadLabel = res["DASHBOARD.UPLOAD"] || "Uploads";
        this.downloadLabel = res["DASHBOARD.DOWNLOAD"] || "Downloads";
        this.tooltipText = res["DASHBOARD.DOCUMENTS"] || "Documents";
        this.updateSeriesLabels();
      });
  }

  private updateSeriesLabels(): void {
    if (this.overviewChartOptions?.series) {
      this.overviewChartOptions.series = [
        { name: this.uploadLabel, data: this.data?.income || [] },
        { name: this.downloadLabel, data: this.data?.expense || [] },
      ];
    }
  }

  private initChartOptions(): void {
    this.overviewChartOptions = {
      series: [
        { name: this.uploadLabel, data: [] },
        { name: this.downloadLabel, data: [] },
      ],
      chart: {
        type: "area",
        height: 300,
        fontFamily: "Cairo, Inter, sans-serif",
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 500,
        },
      },
      colors: [this.colors.primary, this.colors.secondary],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 2.5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.03,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: "#92400e",
            fontSize: "11px",
            fontFamily: "Cairo, Inter, sans-serif",
          },
        },
      },
      yaxis: {
        opposite: this.rtlService.isRtl,
        labels: {
          style: {
            colors: "#92400e",
            fontSize: "11px",
            fontFamily: "Cairo, Inter, sans-serif",
          },
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
      grid: {
        borderColor: "#fde68a", // amber-tinted gridlines
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 8, bottom: 0, left: 8 },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        floating: false,
        offsetY: 0,
        markers: {
          width: 10,
          height: 10,
          radius: 2,
          offsetX: -2,
          offsetY: 1,
        },
        itemMargin: { horizontal: 12, vertical: 4 },
        fontSize: "12px",
        labels: {
          colors: ["#92400e", "#085041"],
          useSeriesColors: false,
        },
      },
      tooltip: {
        theme: "light",
        x: { show: true },
        y: {
          formatter: (val: number) => `${val} ${this.tooltipText}`,
        },
        marker: { show: true },
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.overviewChartOptions) return;

    this.overviewChartOptions = {
      ...this.overviewChartOptions,
      series: [
        { name: this.uploadLabel, data: this.data.income },
        { name: this.downloadLabel, data: this.data.expense },
      ],
      xaxis: {
        ...this.overviewChartOptions.xaxis,
        categories: this.data.duration,
      },
    };
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
