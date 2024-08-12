import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignPanelComponent } from './components/design-area/design-panel/design-panel.component';
import { DesignAreaComponent } from './components/design-area/design-area.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DesignPanelComponent, DesignAreaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Multi-User Real-Time Collaboration Project For Creatingly';

}
