import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomRectModel } from '../../models/dom-rect.model';
import { SharedDataModel } from '../../models/shared-data.model';
import { DomGeneratorService } from '../../services/dom-generator.service';
import { Utility } from '../../utilities/utility';
import { BaseAdjustableComponent } from '../design-tools/base/base-adjustable.component';
import { DesignPanelComponent } from '../design-panel/design-panel.component';

@Component({
  selector: 'app-design-area',
  standalone: true,
  templateUrl: './design-area.component.html',
  styleUrl: './design-area.component.scss',
  imports: [BaseAdjustableComponent, DesignPanelComponent],
  providers: [DomGeneratorService]
})
export class DesignAreaComponent implements AfterViewInit {

  @ViewChild("vcr", { read: ViewContainerRef }) vcr?: ViewContainerRef;

  constructor(private domGeneratorService: DomGeneratorService, private elementRef: ElementRef) {

  }

  ngAfterViewInit(): void {
    if (this.vcr) {
      this.domGeneratorService.setRootViewContainer(this.vcr);
    }
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    (event.target as HTMLElement)?.classList.remove("drag-over");
    let boundry = this.elementRef.nativeElement.getBoundingClientRect() || {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    let mouseRelativeX = +(event.dataTransfer?.getData("mouseRelativeX") || 0);
    let mouseRelativeY = +(event.dataTransfer?.getData("mouseRelativeY") || 0);
    let elementWidth = +(event.dataTransfer?.getData("elementWidth") || 0);
    let elementHeight = +(event.dataTransfer?.getData("elementHeight") || 0);

    let newLeft = event.clientX - mouseRelativeX;
    let newRight = event.clientX - mouseRelativeX + elementWidth;
    let newTop = event.clientY - mouseRelativeY;
    let newBottom = event.clientY - mouseRelativeY + elementHeight;

    // check to make sure the element will be within drag boundary
    if (!(newLeft < boundry.left || newRight > boundry.left + boundry.width || newTop < boundry.top || newBottom > boundry.top + boundry.height)) {
      if (event.dataTransfer?.getData("itemType")) {
        let newItem: SharedDataModel = {} as SharedDataModel;
        newItem.id = Utility.uuidv4();
        newItem.itemType = event.dataTransfer.getData("itemType");
        newItem.domRect = new DomRectModel(event.clientX - mouseRelativeX, event.clientY - mouseRelativeY, elementWidth, elementHeight)
        this.domGeneratorService.renderComponent(newItem.id, newItem, false);
      }
    }
  }

}
