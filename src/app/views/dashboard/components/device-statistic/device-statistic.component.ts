import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";

export interface DeviceStatItem {
  extension: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: "device-statistic",
  templateUrl: "./device-statistic.component.html",
  styleUrls: ["./device-statistic.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceStatisticComponent implements OnChanges {
  @Input() data: any;

  items: DeviceStatItem[] = [];
  total = 0;

  // Warm-toned palette that harmonises with the amber design system
  private readonly palette: string[] = [
    "#b45309", // amber      — primary accent
    "#0f6e56", // teal
    "#185fa5", // blue
    "#4c1d95", // purple
    "#9a3412", // deep amber
    "#065f46", // dark teal
    "#1e3a8a", // deep blue
    "#6b21a8", // deep purple
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.buildItems();
      this.cdr.markForCheck();
    }
  }

  private buildItems(): void {
    if (!Array.isArray(this.data) || this.data.length === 0) {
      this.items = [];
      this.total = 0;
      return;
    }

    // Sort descending by count for a natural ranked display
    const sorted = [...this.data].sort(
      (a: any, b: any) =>
        (b.count ?? b.documentCount ?? 0) - (a.count ?? a.documentCount ?? 0),
    );

    this.total = sorted.reduce(
      (sum: number, d: any) => sum + (d.count ?? d.documentCount ?? 0),
      0,
    );

    this.items = sorted.slice(0, 8).map((d: any, idx: number) => {
      const count = d.count ?? d.documentCount ?? 0;
      const pct = this.total > 0 ? Math.round((count / this.total) * 100) : 0;

      let extension = d.extension ?? d.ext ?? "—";
      if (
        extension.toUpperCase() ===
        "APPLICATION/VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT"
      ) {
        extension = "APPLICATION/DOCX";
      }

      return {
        extension: extension,
        count,
        percentage: pct,
        color: this.palette[idx % this.palette.length],
      };
    });
  }
}
