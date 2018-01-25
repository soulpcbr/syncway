import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { LoopService } from '../services/loop.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {SocketService} from '../services/soket.io.service';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import * as moment from 'moment';

@Component({
   selector: 'app-loop',
   templateUrl: './loop.component.html',
   styleUrls: ['./loop.component.scss'],
   providers: [SocketService]
})
export class LoopComponent implements OnInit {

   loop = {};
   loops = [];
   isLoading = true;
   isEditing = false;

   addLoopForm: FormGroup = null;
   nome = new FormControl('', Validators.required);
   arquivo = new FormControl('', Validators.required);
   delay_main = new FormControl('', Validators.required);
   delay_extra = new FormControl('', Validators.required);
   data = new FormControl('');
   method = new FormControl('', Validators.required);
   api = new FormControl('', Validators.required);

   STATUSSLEEPING = STATUS[STATUS.SLEEPING];
   STATUSCONECTING = STATUS[STATUS.CONECTING];
   STATUSERROR = STATUS[STATUS.ERROR];
   STATUSRUNNING = STATUS[STATUS.RUNNING];

   ioConnection: any;

   constructor(private loopService: LoopService,
               private formBuilder: FormBuilder,
               public toast: ToastComponent,
               private socketService: SocketService
   ) { }

   ngOnInit() {
     this.addLoopForm = this.formBuilder.group({
       nome: this.nome,
       arquivo: this.arquivo,
       delay_main: this.delay_main,
       delay_extra: this.delay_extra,
       data: this.data,
       method: this.method,
       api: this.api,
     });
     this.getLoops().then(() => {
       this.initIoConnection();
       this.startCountdown();
       return;
     }).then(_ => this.isLoading = false);
   }

  private initIoConnection(): void {

    this.ioConnection = this.socketService.onStatus()
      .subscribe((s: any) => {
        console.log('status', s);
        const loop = this.loops.find(((value, index, obj) => value.$loki === s.id));
        loop.nextExecution = s.nextExecution;
        loop.status = s.status;
      });


    this.socketService.onInit()
      .subscribe((s: any) => {
        console.log('onInit', s);
        const loop = this.loops.find(((value, index, obj) => value.$loki === s.id));
        loop.nextExecution = s.nextExecution;
        loop.status = s.status;
      });


    this.socketService.onEvent('connect')
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent('disconnect')
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  startCountdown() {
    TimerObservable.create(1000, 1000).subscribe(t => {
      this.loops.forEach(loop => {
        const now = new Date().getTime();
        const duration = moment.duration((loop.nextExecution || 0) - now, 'milliseconds');
        if (duration.asSeconds() <= 0) {
          loop.timer = 0;
          return;
        }
        loop.timer = duration.asMilliseconds();
      });
    });
  }

   getLoops(): Promise<any> {
     return new Promise( ( resolve, rejected ) => {
       this.loopService.getLoops().subscribe(
         data => this.loops = data.map(l => {
           l.status = STATUS[STATUS.CONECTING];
           return l;
         }),
         error => rejected(error),
         () => resolve(),
       );
     });
   }

   addLoop() {
      this.loopService.addLoop(this.addLoopForm.value).subscribe(
         res => {
            const newLoop = res.json();
            this.loops.push(newLoop);
            this.addLoopForm.reset();
            this.toast.setMessage('item added successfully.', 'success');
         },
         error => console.log(error)
      );
   }

   enableEditing(loop) {
      this.isEditing = true;
      this.loop = loop;
   }

   cancelEditing() {
      this.isEditing = false;
      this.loop = {};
      this.toast.setMessage('item editing cancelled.', 'warning');
      // reload the loops to reset the editing
      this.getLoops();
   }

   editLoop(loop) {
      this.loopService.editLoop(loop).subscribe(
         res => {
            this.isEditing = false;
            this.loop = loop;
            this.toast.setMessage('item edited successfully.', 'success');
         },
         error => console.log(error)
      );
   }

   deleteLoop(loop) {
      if (window.confirm('Are you sure you want to permanently delete this item?')) {
         this.loopService.deleteLoop(loop).subscribe(
            res => {
               const pos = this.loops.map(elem => { return elem.$loki; }).indexOf(loop.$loki);
               this.loops.splice(pos, 1);
               this.toast.setMessage('item deleted successfully.', 'success');
            },
            error => console.log(error)
         );
      }
   }
}

enum STATUS {
  DELETED,
  SLEEPING,
  RUNNING,
  ERROR,
  CONECTING,
}
