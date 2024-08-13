import { Component } from '@angular/core';
import { DraggableDirective } from '../../../directives/draggable.directive';
import { SharedDataModel } from '../../../models/shared-data.model';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-design-panel',
  standalone: true,
  imports: [DraggableDirective],
  templateUrl: './design-panel.component.html',
  styleUrl: './design-panel.component.scss'
})
export class DesignPanelComponent {

  status: 'Connected' | 'Pending' | 'Disconnected' = 'Pending';


  constructor(private websocketService: WebSocketService<SharedDataModel>) {
    this.websocketService.connectionStatus$.subscribe(isOnline => {
      this.status = isOnline ? 'Connected' : 'Disconnected';
    })
  }


  changeStatus() {
    if (this.status === 'Connected') {
      this.websocketService.disconnect();
    } else if (this.status === 'Disconnected') {
      this.status = 'Pending';
      this.websocketService.connect();
    }
  }

}
