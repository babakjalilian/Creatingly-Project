import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Message } from '../models/shared-data.model';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService<T> {

  private webSocket$?: WebSocketSubject<Message<T>>;
  public messages$: Observable<Message<T>> = new Observable();
  public connectionStatus$ = new BehaviorSubject<boolean>(false);

  public connect(): void {
    if (!this.webSocket$ || this.webSocket$.closed) {
      this.webSocket$ = this.getWebSocketConnection();
    }
    this.messages$ = this.webSocket$.pipe(
      retry({ count: 10, delay: environment.reconnectInterval }),
      tap({ error: error => console.log('Websocket connection failed', error) }),
      catchError(() => EMPTY),
    );
  }


  private getWebSocketConnection(): WebSocketSubject<Message<T>> {
    return webSocket({
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
      }

    })
  }

  sendMessage(message: Message<T>): void {
    this.webSocket$?.next(message);
  }

  close() {
    this.webSocket$?.complete();
  }
}
