import { Injectable, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class CollaborationService<T extends { id: string }> implements OnDestroy {
  document: Map<string, T>;
  docName: string = 'DesignDoc';
  isOnline = false;
  connectionStatus$: Observable<boolean>;
  constructor(public websocketService: WebSocketService<T>, public storageService: StorageService<T>) {
    this.document = new Map(this.storageService.loadDoc(this.docName).entries());
    this.connectionStatus$ = this.websocketService.connectionStatus$.pipe(
      tap(status => {
        this.isOnline = status;
        if (status) {
          this.clear();
          this.websocketService.sendMessage({ type: 'new-client' });
          // this.shareFullDocument();
        }
      })
    );
    this.openWebsocket();
  }


  insertItem(newItem: T): void {
    this.document?.set(newItem.id, newItem);
    this.storageService.persistDoc(this.document, this.docName);
  }

  insertAndShareItem(newItem: T): void {
    this.insertItem(newItem)
    this.websocketService.sendMessage({ type: 'add', payload: newItem });
  }


  updateItem(id: string, model: Partial<T>): void {
    const prevItem = this.document?.get(id);
    if (prevItem) {
      const newItem = { ...prevItem, ...model };
      this.document?.set(id, newItem);
      this.storageService.persistDoc(this.document, this.docName);
    }
  }

  updateAndShareItem(id: string, itemType: string, newItemData: Partial<T>): void {
    this.updateItem(id, newItemData);
    if (this.document?.get(id)) {
      this.websocketService.sendMessage({ type: 'update', payload: { id, itemType, ...newItemData } });
    }
  }


  deleteItem(id: string): void {
    this.document?.delete(id);
    this.storageService.persistDoc(this.document, this.docName);
  }

  deleteAndShareItem(id: string): void {
    this.deleteItem(id);
    this.websocketService.sendMessage({ type: 'remove', payload: { id: id } as T });
  }


  clear(): void {
    this.document?.clear();
  }

  closeWebsocket(): void {
    this.websocketService.disconnect();
  }

  openWebsocket(): void {
    this.websocketService.connect();
  }

  shareFullDocument(): void {
    if (this.document) {
      this.document.forEach((value: T) => {
        this.websocketService.sendMessage({ type: 'add', payload: value })
      });
    }
  }


  ngOnDestroy(): void {
    this.closeWebsocket();
  }
}
