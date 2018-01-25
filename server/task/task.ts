
import {EventEmitter} from 'events';
import Loop from '../models/loop';
/**
 * Created by icastilho on 22/05/17.
 */

export class Task extends EventEmitter {

   id: number;
   name: string;
   delay: number;
   execution: any;
   loop: Loop;
   delayType: string;
   private status: STATUS;
   private nextExecution;

   constructor(loop: Loop) {
      super();
      this.name = loop.nome;
      this.delay = loop.delay_main;
      this.loop = loop;
      this.delayType = 'main';
      this.setStatus(STATUS.SLEEPING);
   }

   async run() {
      console.log(`[TASK] ${this.name} :: ${this.status} ... Delay: ${this.getDelay()}` );

      this.nextExecution = setTimeout(async () => {
         if (this.status === STATUS.DELETED) {
            return;
         } else if (this.status !== STATUS.RUNNING) {
            this.setStatus(STATUS.RUNNING);
            console.log(`[TASK] ${this.name} :: ${this.status}`);
            await this.execution();
            this.run();
         } else {
            this.run();
         }
      }, this.getDelay());
   }

   setStatus = (status: STATUS) => {
     // console.log(`[STATUS CHANGE] :: Name:${this.name} - status: ${ STATUS[this.status]}`);
     this.status = status;
     this.emit('onStatus', {id: this.loop.$loki, status: STATUS[status], nextExecution:  this.getDelay() + new Date().getTime() });
   }

   setDelay(delay) {
      this.delay = delay;
   }

   getDelay() {
      return this.delay;
   }

/*
   scheduleNextExecution() {
      this.nextExecutionTime = this.getDelay() + new Date().getTime();
      return this.getDelay();
   }
*/

   setExecution(execution: any) {
      this.execution = execution;
   }

/*
   getNextExecutionTime = () => {
     return this.nextExecutionTime;
   }
*/

   getStatus() {
     return this.status;
   }
}

export enum STATUS {
  DELETED,
  SLEEPING,
  RUNNING,
  ERROR,
}
