import { Component, OnInit, Input } from "@angular/core";
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
export class DeviceStatisticComponent implements OnInit {
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
      .get([
        "TABLE_MESSAGE.EMPTY",
        "TABLE_MESSAGE.SELECTED",
        "TABLE_MESSAGE.TOTAL",
      ])
      .subscribe((res) => {
        this.tableMessages = {
          emptyMessage: res["TABLE_MESSAGE.EMPTY"],
          selectedMessage: res["TABLE_MESSAGE.SELECTED"],
          totalMessage: res["TABLE_MESSAGE.TOTAL"],
        };
      });
  }
}
