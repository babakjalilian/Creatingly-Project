import { Component } from '@angular/core';
import { DraggableDirective } from '../../../directives/draggable.directive';

@Component({
  selector: 'app-design-panel',
  standalone: true,
  imports: [DraggableDirective],
  templateUrl: './design-panel.component.html',
  styleUrl: './design-panel.component.scss'
})
export class DesignPanelComponent {

}
