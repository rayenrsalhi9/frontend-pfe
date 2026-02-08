import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-responses-audit',
  templateUrl: './responses-audit.component.html',
  styleUrls: ['./responses-audit.component.css']
})
export class ResponsesAuditComponent implements OnInit {

  rows: any[] = [];
  filteredRows: any[] = [];
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadMockData();
  }

  // TODO: add service ResponsesAuditService to load real data
  loadMockData(): void {
    this.rows = [
      {
        createdAt: '2026-02-08 14:30:00',
        userName: 'Jean Dupont',
        topicTitle: 'How to use Angular benchmarks?',
        responseContent: 'You should check the official documentation for detailed guides.',
        operation: 'Created',
        ipAddress: '192.168.1.1'
      },
      {
        createdAt: '2026-02-08 14:35:00',
        userName: 'Marie Curie',
        topicTitle: 'SCSS best practices',
        responseContent: 'I recommend using BEM naming convention for better maintainability.',
        operation: 'Updated',
        ipAddress: '192.168.1.45'
      },
      {
        createdAt: '2026-02-08 14:40:00',
        userName: 'Albert Einstein',
        topicTitle: 'Quantum Computing logic',
        responseContent: 'The superposition principle is key to understanding qubits.',
        operation: 'Created',
        ipAddress: '10.0.0.5'
      },
      {
        createdAt: '2026-02-08 14:45:00',
        userName: 'Isaac Newton',
        topicTitle: 'Gravity in web design',
        responseContent: 'Why does my footer keep floating up?',
        operation: 'Deleted',
        ipAddress: '172.16.0.100'
      },
      {
        createdAt: '2026-02-08 14:50:00',
        userName: 'Ada Lovelace',
        topicTitle: 'First algorithm',
        responseContent: 'This is the first known algorithm for the Analytical Engine.',
        operation: 'Created',
        ipAddress: '192.168.0.10'
      },
      {
        createdAt: '2026-02-08 14:55:00',
        userName: 'Grace Hopper',
        topicTitle: 'First compiler',
        responseContent: 'COBOL was the first compiled high-level programming language.',
        operation: 'Created',
        ipAddress: '192.168.0.20'
      },
      {
        createdAt: '2026-02-08 15:00:00',
        userName: 'Marie Curie',
        topicTitle: 'SCSS best practices',
        responseContent: 'I recommend using BEM naming convention for better maintainability.',
        operation: 'Updated',
        ipAddress: '192.168.1.45'
      },
    ];
    this.filteredRows = [...this.rows];
    this.cdr.detectChanges();
  }

  onSearch(term: string): void {
    if (!term || term.trim() === '') {
      this.filteredRows = [...this.rows];
    } else {
      const searchTerm = term.toLowerCase();
      this.filteredRows = this.rows.filter(row => {
        return (
          row.userName?.toLowerCase().includes(searchTerm) ||
          row.topicTitle?.toLowerCase().includes(searchTerm) ||
          row.responseContent?.toLowerCase().includes(searchTerm) ||
          row.operation?.toLowerCase().includes(searchTerm) ||
          row.ipAddress?.toLowerCase().includes(searchTerm)
        );
      });
    }
    this.cdr.detectChanges();
  }

}
