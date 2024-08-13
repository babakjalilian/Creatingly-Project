import { Component } from '@angular/core';
import { DraggableDirective } from '../../../directives/draggable.directive';
import { CRDTService } from '../../../services/crdt.service';
import { SharedDataModel } from '../../../models/shared-data.model';

@Component({
  selector: 'app-design-panel',
  standalone: true,
  imports: [DraggableDirective],
  templateUrl: './design-panel.component.html',
  styleUrl: './design-panel.component.scss'
})
export class DesignPanelComponent {

  status: 'Connected' | 'Pending' | 'Disconnected' = 'Pending';


  constructor(private crdtService: CRDTService<SharedDataModel>) {
    this.crdtService.connectionStatus$.subscribe(isOnline => {
      this.status = isOnline ? 'Connected' : 'Disconnected';

    })
  }


  changeStatus() {
    if (this.status === 'Connected') {
      this.crdtService.close();
    } else if (this.status === 'Disconnected') {
      this.status = 'Pending';
      this.crdtService.open();
    }
  }

}
