import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as socketIo from 'socket.io-client';
import {environment} from '../../environments/environment';

@Injectable()
export class SocketService {

  private socket: SocketIOClient.Socket; // The client instance of socket.io
  constructor() {
    this.socket = socketIo(`${environment.server_url}:${environment.server_port}`, {transports: ['websocket']});
  }

  public onStatus(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('status', (data: any) => observer.next(data));
    });
  }

  public onInit(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('oninit', (data: any) => observer.next(data));
    });
  }



  public onEvent(event: string): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
