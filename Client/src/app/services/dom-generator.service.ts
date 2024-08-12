import { ComponentRef, EnvironmentInjector, inject, Injectable, reflectComponentType, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { BaseAdjustableComponent } from "../components/design-tools/base/base-adjustable.component";
import { DomRectModel } from "../models/dom-rect.model";
import { Message, SharedDataModel } from "../models/shared-data.model";
import { Utility } from "../utilities/utility";
import { CRDTService } from "./crdt.service";


@Injectable({ providedIn: 'root' })
export class DomGeneratorService {
  rootViewContainer?: ViewContainerRef;
  envInjector = inject(EnvironmentInjector);
  components: Map<string, ComponentRef<unknown>> = new Map<string, ComponentRef<unknown>>;
  webSocketSubscription: Subscription = new Subscription();

  constructor(private crdtService: CRDTService<SharedDataModel>) {
    this.webSocketSubscription = crdtService.websocketService.messages$.subscribe((message: Message<SharedDataModel>) => {
      if (message.type === 'add' || message.type === 'update') {
        this.renderComponent(message.payload.id, message.payload);
      } else if (message.type === 'remove') {
        this.deleteComponent(message.payload.id);
      } else if (message.type === 'new-client') {
        this.crdtService.shareFullDocument();
      }
    });
  }

  setRootViewContainer(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
    if (this.crdtService.document) {
      this.crdtService.document.forEach((item: SharedDataModel, key: string) => {
        this.renderComponent(key, item);
      });
    }
  }

  renderComponent(key: string, item: any, isRemote = true) {
    if (this.rootViewContainer) {
      let componentref = this.components.get(key)
      if (!componentref) {
        componentref = this.rootViewContainer.createComponent(Utility.componentTypeResolver(item.itemType), {
          environmentInjector: this.envInjector,
        });

        let domRectSubscription = (componentref.instance as BaseAdjustableComponent).domRectChanged$.pipe(
          // debounce(() => interval(50))
        ).subscribe((event: DomRectModel) => {
          this.crdtService.updateAndShareItem(key, { domRect: event });
        });

        let itemRemoveSubscription = (componentref.instance as BaseAdjustableComponent).itemRemoved$
          .subscribe(() => {
            if (this.components.get(key)) {
              this.components.get(key)?.destroy();
              this.components.delete(key);
              this.crdtService.deleteAndShareItem(key);
            }
          });

        componentref.onDestroy(() => {
          domRectSubscription.unsubscribe();
          itemRemoveSubscription.unsubscribe();
        });
        if (isRemote) {
          this.crdtService.insertItem(item);
        } else {
          this.crdtService.insertAndShareItem(item)
        }
      } else {
        this.crdtService.updateItem(key, item);
      }

      Object.entries(item).forEach(([key, value]) => {
        let componentMetaData = reflectComponentType(componentref.componentType);
        if (componentMetaData && componentMetaData?.inputs.findIndex(item => item.propName === key) > -1) {
          componentref.setInput(key, value);
        }
      });
      this.components.set(key, componentref);
    }
  }

  deleteComponent(key: string) {
    if (this.components.get(key)) {
      this.components.get(key)?.destroy();
      this.components.delete(key);
      this.crdtService.deleteItem(key);
    }
  }

  closWebSocket() {
    this.crdtService.close();
  }

}
