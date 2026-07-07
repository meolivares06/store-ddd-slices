import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button 
      [class]="'btn btn-' + (variant() || 'primary') + (status() === 'clicked' ? ' btn-clicked' : '')" 
      (click)="onClick($event)">
      {{ status() === 'clicked' ? 'ADDED_TO_SYSTEM' : label() }}
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  label = input.required<string>();
  variant = input<'primary' | 'secondary'>('primary');
  clicked = output<MouseEvent>();

  status = signal<'idle' | 'clicked'>('idle');

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
    this.status.set('clicked');
    setTimeout(() => {
      this.status.set('idle');
    }, 1000);
  }
}