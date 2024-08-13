import { Observable, Subject, Subscription, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { WebSocketService } from './websocket.service';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/shared-data.model';

@Injectable({ providedIn: 'root' })
export class CRDTService<T extends { id: string }> {
  document: Map<string, T>;
  docName: string = 'DesignDoc';
  isOnline = false;
  connectionSubscription: Subscription = new Subscription();
  connectionStatus$: Observable<boolean>;
  constructor(public websocketService: WebSocketService<T>, public storageService: StorageService<T>) {
    this.document = new Map(this.storageService.loadDoc(this.docName).entries());
    this.connectionStatus$ = this.websocketService.connectionStatus$.pipe(
      tap(status => {
        this.isOnline = status;
        if (status) {
          this.websocketService.sendMessage({ type: 'new-client' });
          this.shareFullDocument();
        }
      })
    );
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

  updateAndShareItem(id: string, itemType: string, newItemData: Partial<T>) {
    let newItem = this.updateItem(id, newItemData);
    if (newItem) {
      this.websocketService.sendMessage({ type: 'update', payload: { id, itemType, ...newItemData } });
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
    this.websocketService.disconnect();
  }

  open() {
    this.websocketService.connect();
  }

  shareFullDocument() {
    if (this.document) {
      this.document.forEach((value: T) => {
        this.websocketService.sendMessage({ type: 'add', payload: value })
      });
    }
  }
}
