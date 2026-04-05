import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DeviceStatistic } from "../../dashboard.type";
import { TranslateService } from "@ngx-translate/core";
import { RtlService } from "@app/core/rtl.service";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
} from "ng-apexcharts";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
}

interface ExtensionItem {
  extension: string;
  total: number;
  percentage: number;
  color: string;
  icon: string;
}

@Component({
  selector: "device-satistic",
  templateUrl: "./device-statistic.component.html",
  styleUrls: ["./device-statistic.component.scss"],
})
export class DeviceStatisticComponent implements OnInit, OnChanges, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input() data: DeviceStatistic;

  extensions: ExtensionItem[] = [];
  totalCount = 0;
  maxItems = 6;

  chartOptions: Partial<ChartOptions> = {};

  translations = {
    extension: "Extension",
    total: "Total",
    noData: "No data available",
    fileFormats: "File Formats",
    documents: "Documents",
  };

  colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  private extensionIcons: Record<string, string> = {
    pdf: "icon-file-text",
    doc: "icon-file",
    docx: "icon-file",
    xls: "icon-grid",
    xlsx: "icon-grid",
    ppt: "icon-monitor",
    pptx: "icon-monitor",
    jpg: "icon-image",
    jpeg: "icon-image",
    png: "icon-image",
    gif: "icon-image",
    mp4: "icon-video",
    mp3: "icon-music",
    zip: "icon-folder",
    rar: "icon-folder",
    txt: "icon-file-text",
  };

  private extensionLabels: Record<string, string> = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    xls: "Excel",
    xlsx: "Excel",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    jpg: "JPEG",
    jpeg: "JPEG",
    png: "PNG",
    gif: "GIF",
    mp4: "MP4",
    mp3: "MP3",
    zip: "ZIP",
    rar: "RAR",
    txt: "Text",
    // Full MIME subtypes (after splitting on '/')
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
    "vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "vnd.openxmlformats-officedocument.presentationml.presentation":
      "PowerPoint",
    "vnd.ms-excel": "Excel",
    "vnd.ms-powerpoint": "PowerPoint",
    msword: "Word",
    "octet-stream": "Binary",
    plain: "Text",
  };

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private rtlService: RtlService,
  ) {}

  ngOnInit(): void {
    this.translate
      .stream([
        "TABLE_MESSAGE.EXTENSION",
        "TABLE_MESSAGE.TOTAL",
        "DASHBOARD.NO_DEVICES",
        "DASHBOARD.FILE_FORMATS",
        "DASHBOARD.DOCUMENTS",
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.translations = {
          extension: res["TABLE_MESSAGE.EXTENSION"] || "Extension",
          total: res["TABLE_MESSAGE.TOTAL"] || "Total",
          noData: res["DASHBOARD.NO_DEVICES"] || "No data available",
          fileFormats: res["DASHBOARD.FILE_FORMATS"] || "File Formats",
          documents: res["DASHBOARD.DOCUMENTS"] || "Documents",
        };
        this.buildChart();
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"] && this.data) {
      this.processData();
    }
  }

  /** Normalise a raw extension or MIME type string to a lookup key.
   *  "application/pdf" -> "pdf" | "IMAGE/JPEG" -> "jpeg" | "pdf" -> "pdf" */
  private resolveMimeKey(raw: string): string {
    if (!raw) return "";
    const lower = raw.toLowerCase().trim();
    // If it contains a slash it's a MIME type — use the subtype part
    if (lower.includes("/")) {
      return lower.split("/").pop() || lower;
    }
    // Already a bare extension (e.g. "pdf", ".pdf")
    return lower.replace(/^[.]/, "");
  }

  private processData(): void {
    if (!this.data?.documents || this.data.documents.length === 0) {
      this.extensions = [];
      this.totalCount = 0;
      this.chartOptions = {};
      return;
    }

    const totalDocs = Number(this.data.totalDocuments) || 1;
    this.totalCount = totalDocs;

    this.extensions = this.data.documents
      .map((item, index) => {
        const key = this.resolveMimeKey(item.extension || "");
        const label = this.extensionLabels[key] || key.toUpperCase();
        return {
          extension: label,
          total: Number(item.total) || 0,
          percentage: Math.round((Number(item.total) / totalDocs) * 100),
          color: this.colors[index % this.colors.length],
          icon: this.extensionIcons[key] || "icon-file",
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, this.maxItems);

    this.buildChart();
  }

  private buildChart(): void {
    if (this.extensions.length === 0) return;

    const categories = this.extensions.map((e) => e.extension);
    const values = this.extensions.map((e) => e.total);
    const colors = this.extensions.map((e) => e.color);
    const docLabel = this.translations.documents;

    this.chartOptions = {
      series: [{ name: docLabel, data: values }],
      chart: {
        type: "bar",
        height: this.extensions.length * 44 + 20,
        fontFamily: "Cairo, Inter, sans-serif",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 600,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "55%",
          distributed: true,
        },
      },
      colors,
      dataLabels: {
        enabled: true,
        formatter: (val: number) => (val > 0 ? val.toString() : ""),
        style: {
          fontSize: "11px",
          fontFamily: "Cairo, Inter, sans-serif",
          fontWeight: "600",
          colors: ["#ffffff"],
        },
        offsetX: 6,
      },
      xaxis: {
        categories,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        opposite: this.rtlService.isRtl,
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Cairo, Inter, sans-serif",
            colors: "#64748b",
          },
          maxWidth: 120,
        },
      },
      grid: {
        show: false,
        padding: { left: 8, right: 16, top: -12, bottom: -8 },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val: number) => `${val} ${docLabel}`,
        },
      },
    };

    this.cdr.markForCheck();
  }

  getMaxPercentage(): number {
    if (this.extensions.length === 0) return 0;
    return Math.max(...this.extensions.map((e) => e.percentage));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
