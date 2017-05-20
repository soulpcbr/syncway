import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class LoopService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getLoops(): Observable<any> {
    return this.http.get('/api/loops').map(res => res.json());
  }

  countLoops(): Observable<any> {
    return this.http.get('/api/loops/count').map(res => res.json());
  }

  addLoop(loop): Observable<any> { console.log( JSON.stringify(loop))
    return this.http.post('/api/loop', JSON.stringify(loop), this.options);
  }

  getLoop(loop): Observable<any> {
    return this.http.get(`/api/loop/${loop.$loki}`).map(res => res.json());
  }

  editLoop(loop): Observable<any> {
    return this.http.put(`/api/loop/${loop.$loki}`, JSON.stringify(loop), this.options);
  }

  deleteLoop(loop): Observable<any> {
    return this.http.delete(`/api/loop/${loop.$loki}`, this.options);
  }

}
