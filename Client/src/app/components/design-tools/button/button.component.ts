import { Component } from '@angular/core';
import { BaseAdjustableComponent } from '../base/base-adjustable.component';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [BaseAdjustableComponent],
})
export class ButtonComponent extends BaseAdjustableComponent {

}
