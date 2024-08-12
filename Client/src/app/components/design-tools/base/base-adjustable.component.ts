import { DOCUMENT } from "@angular/common";
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { DomRectModel } from "../../../models/dom-rect.model";
import { ResizeAnchorType } from "../../../models/resize-anchor.type";


@Component({
  selector: "[app-free-dragging]",
  template: '',
  standalone: true,
})
export class BaseAdjustableComponent implements OnInit, OnDestroy, OnChanges {
  private element!: HTMLElement;
  private removeHandlerElement!: HTMLElement;
  private destroy$: Subject<void> = new Subject();

  @Input('reject') reject: boolean = false;
  @Input() id!: string;
  @Input() domRect!: DomRectModel
  @Output() domRectChanged$: EventEmitter<DomRectModel> = new EventEmitter<DomRectModel>();
  @Output() itemRemoved$: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    if (!this.reject) {
      this.element = this.elementRef.nativeElement as HTMLElement;
      this.initDrag();
      this.addRemoveHandler();
    }
  }

  ngAfterViewInit(): void {
    this.setDimension();
    this.createHandlers();
  }

  createHandlers() {
    if (!this.reject) {
      (this.elementRef.nativeElement as HTMLElement).classList.add('resizable')
      this.createResizers('top-left');
      this.createResizers('top');
      this.createResizers('top-right');
      this.createResizers('right');
      this.createResizers('bottom-right');
      this.createResizers('bottom');
      this.createResizers('bottom-left');
      this.createResizers('left');
    }
  }

  createResizers(className: ResizeAnchorType): any {
    const resizerElement = this.renderer.createElement('div');
    this.renderer.addClass(resizerElement, `resizer`);
    this.renderer.addClass(resizerElement, className);
    let anchors = className.split('-') as ResizeAnchorType[];
    this.initResize(resizerElement, anchors)
    this.renderer.appendChild(this.elementRef.nativeElement, resizerElement);
  }

  initResize(resizeElement: HTMLElement, anchors: ResizeAnchorType[]): void {
    const resizeStart$ = fromEvent<MouseEvent>(resizeElement, "mousedown").pipe(takeUntil(this.destroy$));
    const resizeEnd$ = fromEvent<MouseEvent>(this.document, "mouseup").pipe(takeUntil(this.destroy$));
    const resize$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(takeUntil(resizeEnd$));

    resizeStart$.subscribe((event: MouseEvent) => {
      this.element.classList.add('resizing');
      event.stopPropagation();
      event.preventDefault();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const elementLastX = this.domRect.x;
      const elementLastY = this.domRect.y;
      const dimensionWidth = this.element.offsetWidth;
      const dimensionHeight = this.element.offsetHeight;

      resize$.subscribe((e: MouseEvent) => {
        let
          width = dimensionWidth,
          height = dimensionHeight,
          dw = e.clientX - mouseX,
          dh = e.clientY - mouseY

        const isLeft = anchors.includes('left');
        const isRight = anchors.includes('right');
        const isTop = anchors.includes('top');
        const isBottom = anchors.includes('bottom');

        if (isLeft) {
          let newX = elementLastX + dw;
          this.domRect.x = this.domRect.left = newX;
          width = width - dw;
        }

        if (isRight) {
          width = width + dw
        }

        if (isTop) {
          let newY = elementLastY + dh;
          this.domRect.y = this.domRect.top = newY;
          height = height - dh;
        }

        if (isBottom) {
          height = height + dh;
        }

        this.domRect.width = width;
        this.domRect.height = height;
        this.setDimension();
        this.domRectChanged$.emit(this.domRect);
      });
    })

    resizeEnd$.subscribe(() => {
      this.element.classList.remove('resizing');
    });
  }

  initDrag(): void {
    this.element.classList.add('draggable');
    const dragStart$ = fromEvent<MouseEvent>(this.element, "mousedown").pipe(takeUntil(this.destroy$));
    const dragEnd$ = fromEvent<MouseEvent>(this.document, "mouseup").pipe(takeUntil(this.destroy$));
    const drag$ = fromEvent<MouseEvent>(this.document, "mousemove").pipe(takeUntil(dragEnd$));


    dragStart$.subscribe((event: MouseEvent) => {
      this.element.classList.add('dragging');
      event.stopPropagation();
      event.preventDefault();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const elementLastX = this.domRect.x;
      const elementLastY = this.domRect.y;

      let dragBoundry = this.getDragBoundry();
      let elementDomRect = this.element.getBoundingClientRect();

      let dragSubscription = drag$.subscribe((e: MouseEvent) => {
        let dx = e.clientX - mouseX;
        let dy = e.clientY - mouseY;
        var newLeft = elementLastX + dx;
        var newTop = elementLastY + dy;

        // check to make sure the element will be within drag boundary
        if (newLeft > dragBoundry.left && newLeft + elementDomRect.width < dragBoundry.right) {
          this.domRect.x = this.domRect.left = newLeft;
        } else {
          // handling high mouse speed when dragging
          this.domRect.x = this.domRect.left = newLeft < dragBoundry.left ? dragBoundry.left : dragBoundry.right - elementDomRect.width
        }

        if (newTop > dragBoundry.top && newTop + elementDomRect.height < dragBoundry.bottom) {
          this.domRect.y = this.domRect.top = newTop;
        } else {
          // handling high mouse speed when dragging
          this.domRect.y = this.domRect.top = newTop < dragBoundry.top ? dragBoundry.top : dragBoundry.bottom - elementDomRect.height
        };


        if (dx !== 0 || dy !== 0) {
          this.setDimension();
          this.domRectChanged$.emit(this.domRect);
        }
      })

      let dragEndSubscription = dragEnd$.subscribe((e) => {
        dragSubscription.unsubscribe();
        dragEndSubscription.unsubscribe();
        this.element.classList.remove('dragging');
      });

    });
  }

  getDragBoundry() {
    let boundry = document.getElementById('designArea')?.getBoundingClientRect() || {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
    return {
      left: boundry.left + 5,
      right: boundry.left + boundry.width - 5,
      top: boundry.top + 5,
      bottom: boundry.top + boundry.height - 5,
    }
  }

  addRemoveHandler() {
    this.removeHandlerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.removeHandlerElement, 'remove-handler');
    const removeIconElement = this.renderer.createElement('i');
    this.renderer.addClass(removeIconElement, 'delete-icon');
    fromEvent<MouseEvent>(this.removeHandlerElement, "click").pipe(takeUntil(this.destroy$)).subscribe((e: MouseEvent) => {
      e.stopPropagation();
      this.itemRemoved$.emit();
    });
    this.renderer.appendChild(this.removeHandlerElement, removeIconElement);
    this.renderer.appendChild(this.element, this.removeHandlerElement);
  }

  setDimension() {
    if (this.domRect) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.domRect.height + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'width', this.domRect.width + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'top', this.domRect.top + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'left', this.domRect.left + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'y', this.domRect.top + "px");
      this.renderer.setStyle(this.elementRef.nativeElement, 'x', this.domRect.left + "px");
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['domRect'])
      this.setDimension();
  }
}