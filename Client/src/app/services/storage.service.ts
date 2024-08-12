import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService<T> {

  persistDoc(document: Map<string, T>, docName: string) {
    window.localStorage.setItem(docName, JSON.stringify(Array.from(document.entries())));
  }


  loadDoc(docName: string): Map<string, T> {
    const doc = localStorage.getItem(docName);
    if (doc) {
      return new Map(JSON.parse(doc));
    } else {
      return new Map<string, T>();
    }
  }

}