import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DeviceStatistic } from "../../dashboard.type";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "device-satistic",
  templateUrl: "./device-statistic.component.html",
  host: {
    "[class.card]": "true",
  },
})
export class DeviceStatisticComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @Input() data: DeviceStatistic;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  progressType: string[] = [
    "danger",
    "warning",
    "info",
    "primary",
    "light",
    "success",
    "secondary",
  ];

  tableMessages = {
    emptyMessage: "",
    selectedMessage: "",
    totalMessage: "",
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate
      .stream([
        "TABLE_MESSAGE.EMPTY",
        "TABLE_MESSAGE.SELECTED",
        "TABLE_MESSAGE.TOTAL",
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.tableMessages = {
          emptyMessage: res["TABLE_MESSAGE.EMPTY"],
          selectedMessage: res["TABLE_MESSAGE.SELECTED"],
          totalMessage: res["TABLE_MESSAGE.TOTAL"],
        };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
