import { Directive } from '@angular/core';

@Directive({
  selector: '[dropZone]',
  standalone: true,
})
export class DropZoneDirective {

  // constructor(private elementRef: ElementRef, private renderer: Renderer2, private viewContainerRef: ViewContainerRef, private componentLoaderService: ComponentLoaderService) {
  //   let source = elementRef.nativeElement;
  //   source.classList.add('drop-zone');

  //   source.addEventListener(
  //     "dragover",
  //     this.dragOver
  //   );

  //   source.addEventListener("dragenter", this.dragEnter);
  //   // source.addEventListener("dragleave", this.dragLeave);
  //   // source.addEventListener("drop", this.drop)
  // }

  // dragOver = (event: any) => {
  //   console.log("🚀 ~ file: drop-zone.directive.ts:27 ~ DropZoneDirective ~ event:", event);
  //   (this.elementRef.nativeElement as HTMLElement).style.backgroundColor = 'red';
  //   this.componentLoaderService.setViewContainerRef(this.viewContainerRef);
  //   this.componentLoaderService.setElementRef(this.elementRef);
  //   this.componentLoaderService.setRenderer(this.renderer);

  //   // prevent default to allow drop
  //   event.preventDefault();
  //   event.stopPropagation()
  // }

  // dragEnter = (event: any) => {

  //   // highlight potential drop target when the draggable element enters it
  //   if (event.target.classList.contains("drop-zone")) {
  //     event.target.classList.add("drag-over");
  //   }
  // }

  // dragLeave = (event: any) => {
  //   // reset background of potential drop target when the draggable element leaves it
  //   if (event.target.classList.contains("drop-zone")) {
  //     event.target.classList.remove("drag-over");
  //   }
  // }

}