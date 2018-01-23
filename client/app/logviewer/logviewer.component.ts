import { Component, OnInit } from '@angular/core';
import {LogsService} from '../services/logs.service';
import {isArray} from 'util';

@Component({
  selector: 'app-logviewer',
  templateUrl: './logviewer.component.html',
  styleUrls: ['./logviewer.component.scss'],
  providers: [ LogsService ]
})
export class LogviewerComponent implements OnInit {

  limit = 50;
  range = [];
  lines: string[] = [];

  constructor(public logsService: LogsService) { }

  ngOnInit() {
    const now = new Date();
    const from = new Date();
    from.setHours(now.getHours() - 1);
    this.range = [from, now];
    this.load();
  }

  load() {
    this.logsService.getLogs(this.limit, this.range[0], this.range[1]).subscribe(
      (line) => {
        if (isArray(line.logs.file)) {
          this.lines = line.logs.file;
        }
      }
    );
  }

  doFilter() {
    this.load();
  }
}
