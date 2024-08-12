import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class CRDTService<T extends { id: string }> {
  document: Map<string, T>;
  docName: string = 'DesignDoc';
  isOnline = false;
  constructor(public websocketService: WebSocketService<T>, public storageService: StorageService<T>) {
    this.document = new Map(this.storageService.loadDoc(this.docName).entries());
    this.open();
  }

  insertItem(newItem: T) {
    this.document?.set(newItem.id, newItem);
    // if (this.document) {
    this.storageService.persistDoc(this.document, this.docName);
    // }
  }

  updateItem(id: string, model: Partial<T>): T | void {
    const prevItem = this.document?.get(id);
    if (prevItem) {
      const newItem = { ...prevItem, ...model };
      this.document?.set(id, newItem);
      // if (this.document) {
      this.storageService.persistDoc(this.document, this.docName);
      // }
      return newItem;
    }
    return;
  }

  deleteItem(id: string) {
    this.document?.delete(id);
    // if (this.document) {
    this.storageService.persistDoc(this.document, this.docName);
    // }
  }

  insertAndShareItem(newItem: T) {
    this.insertItem(newItem)
    this.websocketService.sendMessage({ type: 'add', payload: newItem });
  }

  updateAndShareItem(id: string, newItemData: Partial<T>) {
    let newItem = this.updateItem(id, newItemData);
    if (newItem) {
      this.websocketService.sendMessage({ type: 'update', payload: newItem });
    }
  }

  deleteAndShareItem(id: string) {
    this.deleteItem(id);
    this.websocketService.sendMessage({ type: 'remove', payload: { id: id } as T });
  }

  clear() {
    this.document?.clear();
  }

  close() {
    this.websocketService.close();
    this.isOnline = false;
  }

  open() {
    this.websocketService.connect();
    this.websocketService.connectionStatus$.subscribe((status: boolean) => {
      if (!this.isOnline && status) {
        this.websocketService.sendMessage({ type: 'new-client' });
        this.shareFullDocument();
      }
      this.isOnline = status;
    })
  }

  shareFullDocument() {
    if (this.document) {
      this.document.forEach((value: T) => {
        this.websocketService.sendMessage({ type: 'add', payload: value })
      });
    }
  }
}
