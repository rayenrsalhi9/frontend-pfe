import { Component, OnInit, Input } from '@angular/core';
import { DeviceStatistic, DeviceStatisticData } from '../../dashboard.type';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'device-satistic',
  templateUrl: './device-statistic.component.html',
  host: {
    '[class.card]': 'true'
  }
})
export class DeviceStatisticComponent implements OnInit {

  @Input() data: DeviceStatistic
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  progressType: string[] = ['danger', 'warning', 'info', 'primary', 'light', 'success', 'secondary']

  constructor() { }

  ngOnInit(): void { }
}
