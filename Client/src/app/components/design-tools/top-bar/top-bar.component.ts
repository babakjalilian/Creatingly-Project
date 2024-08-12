import { Component } from '@angular/core';
import { BaseAdjustableComponent } from '../base/base-adjustable.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  imports: [BaseAdjustableComponent],
})
export class TopBarComponent extends BaseAdjustableComponent {

}
