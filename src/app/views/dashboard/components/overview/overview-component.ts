import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { OverviewData } from '../../dashboard.type';
import {
  ApexBarDefault,
  ApexChartDefault,
  ApexDataLabelDefault,
  COLOR_2,
  COLOR_3
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
} from "ng-apexcharts";
import { defaultLanguge } from '@app/configs/i18n.config';
import { DashboradService } from '@app/shared/services/dashboard.service';

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
  selector: 'overview',
  templateUrl: './overview-component.html',
  host: {
    '[class.card]': 'true'
  }
})
export class OverviewComponent implements OnInit {
  @ViewChild('overviewChart') chart: ChartComponent;
  public overviewChartOptions: Partial<ChartOptions>;

  @Input() data: OverviewData
  serieUpload = 'Upload';
  serieDownload = 'Download';

  constructor(
    private dash: DashboradService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.dash.emitter$.subscribe(data => {
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
      this.initChart()
    })
    this.initChart()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.initChart()
    }
  }

  initChart(rss = null) {
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

    if (this.data) {

      this.overviewChartOptions.series[0].data = this.data.income
      this.overviewChartOptions.series[1].data = this.data.expense
      this.overviewChartOptions.xaxis.categories = this.data.duration

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
  }
}
