import { ComponentRef, EnvironmentInjector, inject, Injectable, OnDestroy, reflectComponentType, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { BaseAdjustableComponent } from "../components/design-tools/base/base-adjustable.component";
import { ButtonComponent } from "../components/design-tools/button/button.component";
import { TextFieldComponent } from "../components/design-tools/text-field/text-field.component";
import { DomRectModel } from "../models/dom-rect.model";
import { Message, SharedDataModel } from "../models/shared-data.model";
import { Utility } from "../utilities/utility";
import { CollaborationService } from "./collaboration.service";


@Injectable()
export class DomGeneratorService implements OnDestroy {
  rootViewContainer?: ViewContainerRef;
  envInjector = inject(EnvironmentInjector);
  components: Map<string, ComponentRef<unknown>> = new Map<string, ComponentRef<unknown>>;
  webSocketSubscription: Subscription = new Subscription();
  connectionStatusSubscription: Subscription = new Subscription();


  constructor(private collaborationService: CollaborationService<SharedDataModel>) {
    this.connectWebsocket();
    this.connectionStatusSubscription = collaborationService.connectionStatus$.subscribe(status => {
      if (status) {
        this.resetView();
      }
    })
  }

  setRootViewContainer(viewContainerRef: ViewContainerRef): void {
    this.rootViewContainer = viewContainerRef;
    this.retriveSession();
  }

  retriveSession(): void {
    // Retrive session from local storage when user is offline
    if (this.collaborationService.document) {
      this.collaborationService.document.forEach((item: SharedDataModel, key: string) => {
        this.renderComponent(key, item);
      });
    }
  }

  renderComponent(key: string, item: SharedDataModel, isRemote = true): void {
    if (this.rootViewContainer) {
      let componentRef = this.components.get(key)
      if (!componentRef) {
        componentRef = this.rootViewContainer.createComponent(Utility.componentTypeResolver(item.itemType), {
          environmentInjector: this.envInjector,
        });

        let domRectSubscription = (componentRef.instance as BaseAdjustableComponent).domRectChanged$.pipe(
          // debounce(() => interval(50))
        ).subscribe((event: DomRectModel) => {
          this.collaborationService.updateAndShareItem(key, item.itemType, { domRect: event });
        });

        let itemRemoveSubscription = (componentRef.instance as BaseAdjustableComponent).removed$
          .subscribe(() => {
            if (this.components.get(key)) {
              this.components.get(key)?.destroy();
              this.components.delete(key);
              this.collaborationService.deleteAndShareItem(key);
            }
          });

        let labelChangedSubscription: Subscription;
        if (componentRef.componentType === ButtonComponent) {
          labelChangedSubscription = (componentRef.instance as ButtonComponent).labelChanged$.subscribe((label: string) => {
            this.collaborationService.updateAndShareItem(key, item.itemType, { label: label });
          });
        }

        let valueChangedSubscription: Subscription;
        if (componentRef.componentType === TextFieldComponent) {
          valueChangedSubscription = (componentRef.instance as TextFieldComponent).valueChanged$.subscribe((value: string) => {
            this.collaborationService.updateAndShareItem(key, item.itemType, { value: value });
          });
        }

        // let componentMetaData = reflectComponentType(componentRef.componentType);
        componentRef.onDestroy(() => {
          // componentMetaData?.outputs.forEach(emitter => {
          //   (componentRef?.instance as any)[emitter.propName].unsubscribe();
          // })
          domRectSubscription.unsubscribe();
          itemRemoveSubscription.unsubscribe();
          labelChangedSubscription?.unsubscribe();
          valueChangedSubscription?.unsubscribe();
        });
        if (isRemote) {
          this.collaborationService.insertItem(item);
        } else {
          this.collaborationService.insertAndShareItem(item)
        }
      } else {
        this.collaborationService.updateItem(key, item);
      }

      Object.entries(item).forEach(([key, value]) => {
        let componentMetaData = reflectComponentType(componentRef.componentType);
        if (componentMetaData && componentMetaData?.inputs.findIndex(item => item.propName === key) > -1) {
          componentRef.setInput(key, value);
        }
      });
      this.components.set(key, componentRef);
    }
  }

  deleteComponent(key: string): void {
    if (this.components.get(key)) {
      this.components.get(key)?.destroy();
      this.components.delete(key);
      this.collaborationService.deleteItem(key);
    }
  }

  resetView(): void {
    if (this.collaborationService.document) {
      this.rootViewContainer?.clear();
      this.components.clear();
      this.collaborationService.clear();
    }
  }

  connectWebsocket(): void {
    this.webSocketSubscription = this.collaborationService.websocketService.messages.subscribe((message: Message<SharedDataModel>) => {
      if (message.type === 'add' || message.type === 'update') {
        this.renderComponent(message.payload.id, message.payload);
      } else if (message.type === 'remove') {
        this.deleteComponent(message.payload.id);
      } else if (message.type === 'new-client') {
        this.collaborationService.shareFullDocument();
      }
    });
  }

  ngOnDestroy(): void {
    this.collaborationService.closeWebsocket();
    this.webSocketSubscription.unsubscribe(); // ?
    this.connectionStatusSubscription.unsubscribe();
  }

}
