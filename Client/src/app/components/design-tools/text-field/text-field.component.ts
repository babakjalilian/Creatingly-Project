import { Component } from '@angular/core';
import { BaseAdjustableComponent } from '../base/base-adjustable.component';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  imports: [BaseAdjustableComponent],
})
export class TextFieldComponent extends BaseAdjustableComponent {

}
