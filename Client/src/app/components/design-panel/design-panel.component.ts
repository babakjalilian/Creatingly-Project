import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DraggableDirective } from '../../directives/draggable.directive';
import { SharedDataModel } from '../../models/shared-data.model';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-design-panel',
  standalone: true,
  imports: [DraggableDirective, CommonModule],
  templateUrl: './design-panel.component.html',
  styleUrl: './design-panel.component.scss',
})
export class DesignPanelComponent implements OnDestroy {

  status: 'Connected' | 'Pending' | 'Disconnected' = 'Pending';
  private destroy$: Subject<void> = new Subject();

  constructor(private websocketService: WebSocketService<SharedDataModel>) {
    this.websocketService.connectionStatus$.pipe(takeUntil(this.destroy$)).subscribe(isOnline => {
      this.status = isOnline ? 'Connected' : 'Disconnected';
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeStatus(): void {
    if (this.status === 'Connected') {
      this.websocketService.disconnect();
    } else if (this.status === 'Disconnected') {
      this.status = 'Pending';
      this.websocketService.connect();
    }
  }

}
