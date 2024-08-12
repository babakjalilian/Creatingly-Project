import { Component } from '@angular/core';
import { BaseAdjustableComponent } from '../base/base-adjustable.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  imports: [BaseAdjustableComponent],
  // providers: [ComponentLoaderService]
})
export class SearchBarComponent extends BaseAdjustableComponent {

}
