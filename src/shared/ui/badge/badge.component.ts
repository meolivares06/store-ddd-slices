import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge">{{ text() }}</span>`,
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  text = input.required<string>();
}
