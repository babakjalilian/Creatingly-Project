import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Message } from '../models/shared-data.model';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService<T> {

  private messages$: Subject<Message<T>> = new Subject<Message<T>>();
  public messages: Observable<Message<T>> = this.messages$.asObservable();
  public connectionStatus$ = new BehaviorSubject<boolean>(false);
  private webSocketSubject?: WebSocketSubject<Message<T>>;

  public connect(): void {
    if (this.webSocketSubject) {
      this.webSocketSubject.unsubscribe();
    }
    this.webSocketSubject = webSocket({
      url: environment.wsServerUrl,
      openObserver: {
        next: () => {
          this.connectionStatus$.next(true);
        }
      },
      closeObserver: {
        next: () => {
          this.connectionStatus$.next(false);
        }
      },
    });

    this.webSocketSubject.pipe(
      retry({ count: 10, delay: environment.reconnectInterval }),
      tap({ error: error => console.log('Websocket connection failed', error) }),
      catchError(() => EMPTY),
    ).subscribe(message => {
      this.messages$.next(message)
    });
  }

  sendMessage(message: Message<T>): void {
    this.webSocketSubject?.next(message);
  }

  disconnect() {
    this.webSocketSubject?.unsubscribe();
  }
}
