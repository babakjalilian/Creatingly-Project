import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseAdjustableComponent } from '../base/base-adjustable.component';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [BaseAdjustableComponent],
})
export class ButtonComponent extends BaseAdjustableComponent {

  @Input('label') label = 'label';
  @Output() labelChanged$: EventEmitter<string> = new EventEmitter();

  changeLabel(event: Event) {
    this.label = (event.target as HTMLButtonElement)?.textContent || '';
    this.labelChanged$.emit(this.label)
  }

}
