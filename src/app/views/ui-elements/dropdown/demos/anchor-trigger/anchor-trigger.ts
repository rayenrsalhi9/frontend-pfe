import { Component } from '@angular/core';

@Component({
  selector: 'demo-dropdown-anchor-trigger',
  templateUrl: './anchor-trigger.html'
})
export class DemoDropdownAnchorTriggerComponent {
  items: string[] = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  onHidden(): void {
  }
  onShown(): void {
  }
  isOpenChange(): void {
  }
}
