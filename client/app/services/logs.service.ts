import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LogsService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getLogs = (limit, from?, until?): Observable<any> => {
    return this.http.get(`/api/logs/1?limit=${limit}&from=${from}&until=${until}`, this.options).map(res => res.json());
  }

}
