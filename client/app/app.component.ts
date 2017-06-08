import {Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isFirstExecution = false;

  constructor(public auth: AuthService,
              private userService: UserService) { }

  ngOnInit() { console.log('ngOnInit:');
    this.userService.countUsers().subscribe(
      (value) => { console.log('value:', value);
        this.isFirstExecution = (value === 0); }
    );
  }

}
