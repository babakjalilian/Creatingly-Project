import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[draggable]',
  standalone: true
})
export class DraggableDirective {

  @Input('draggable') itemType: string = 'text';
  mouseRelativeX = 0;
  mouseRelativeY = 0;
  elementWidth = 0;
  elementHeight = 0;
  boundaryElement: HTMLElement | null;

  constructor(private elementRef: ElementRef) {
    let source = elementRef.nativeElement;
    source.addEventListener("dragstart", this.dragStart);
    source.addEventListener("drag", this.drag);
    source.addEventListener("dragend", this.dragEnd);
    this.boundaryElement = document.getElementById('designArea');
  }

  dragStart = (event: DragEvent) => {
    let img = event.target as Element;
    event?.dataTransfer?.setData("itemType", this.itemType);
    this.mouseRelativeX = event.offsetX;
    this.mouseRelativeY = event.offsetY;
    this.elementWidth = (event.target as HTMLElement).offsetWidth;
    this.elementHeight = (event.target as HTMLElement).offsetHeight;
    event.dataTransfer?.setDragImage(img, this.mouseRelativeX, this.mouseRelativeY);
    event?.dataTransfer?.setData("mouseRelativeX", `${this.mouseRelativeX}`);
    event?.dataTransfer?.setData("mouseRelativeY", `${this.mouseRelativeY}`);
    event?.dataTransfer?.setData("elementWidth", `${this.elementWidth}`);
    event?.dataTransfer?.setData("elementHeight", `${this.elementHeight}`);

    (event.target as HTMLElement).classList.add("dragging");
  }



  drag = (event: DragEvent) => {
    event.preventDefault();
    let boundry = this.boundaryElement?.getBoundingClientRect() || {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newLeft = event.clientX - this.mouseRelativeX;
    // console.log("🚀 ~ file: draggable.directive.ts:50 ~ DraggableDirective ~ newLeft:", newLeft)
    let newRight = event.clientX - this.mouseRelativeX + this.elementWidth;
    let newTop = event.clientY - this.mouseRelativeY;
    let newBottom = event.clientY - this.mouseRelativeY + this.elementHeight;

    // check to make sure the element will be within drag boundary
    if (newLeft < boundry.left || newRight > boundry.left + boundry.width || newTop < boundry.top || newBottom > boundry.top + boundry.height) {
      this.boundaryElement && (this.boundaryElement.classList.add('no-drop'));
    } else {
      this.boundaryElement && (this.boundaryElement.classList.remove('no-drop'))
    }
  }

  dragEnd = () => {
    this.boundaryElement && (this.boundaryElement.classList.remove('no-drop'))
  }




}
