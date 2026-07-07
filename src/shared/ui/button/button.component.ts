import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [class]="'btn btn-' + (variant() || 'primary')" (click)="clicked.emit($event)">
      {{ label() }}
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  label = input.required<string>();
  variant = input<'primary' | 'secondary'>('primary');
  clicked = output<MouseEvent>();
}
