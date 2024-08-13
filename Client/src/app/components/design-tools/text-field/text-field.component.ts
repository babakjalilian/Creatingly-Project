import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseAdjustableComponent } from '../base/base-adjustable.component';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  imports: [BaseAdjustableComponent],
})
export class TextFieldComponent extends BaseAdjustableComponent {

  @Input('value') value = 'value';
  @Output() valueChanged$: EventEmitter<string> = new EventEmitter();

  changeValue(event: Event) {
    this.value = (event.target as HTMLButtonElement)?.value || '';
    this.valueChanged$.emit(this.value)
  }
}
