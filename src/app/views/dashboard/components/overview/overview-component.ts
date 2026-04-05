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

  private colors = {
    primary: "#2563eb",
    secondary: "#10b981",
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
        if (this.overviewChartOptions?.yaxis) {
          this.overviewChartOptions.yaxis.opposite = isRtl;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnInit(): void {
    this.translateLabels();
  }

  private translateLabels() {
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

  private updateSeriesLabels() {
    if (this.overviewChartOptions?.series) {
      this.overviewChartOptions.series = [
        { name: this.uploadLabel, data: this.data?.income || [] },
        { name: this.downloadLabel, data: this.data?.expense || [] },
      ];
    }
  }

  private initChartOptions() {
    this.overviewChartOptions = {
      series: [
        { name: this.uploadLabel, data: [] },
        { name: this.downloadLabel, data: [] },
      ],
      chart: {
        type: "area",
        height: 280,
        fontFamily: "Cairo, Inter, sans-serif",
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: false },
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
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: "#64748b", fontSize: "11px" },
        },
      },
      yaxis: {
        opposite: this.rtlService.isRtl,
        labels: {
          style: { colors: "#64748b", fontSize: "11px" },
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
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
        itemMargin: {
          horizontal: 12,
          vertical: 4,
        },
        fontSize: "12px",
        labels: {
          colors: ["#64748b", "#64748b"],
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData() {
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
