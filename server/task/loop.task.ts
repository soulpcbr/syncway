import async from 'async';
import {Task} from './task';
import Loop from '../models/loop';
import loopInstance, {LoopService} from '../service/loop.service';
import {EventEmitter} from 'events';
const fs = require('fs');

const tasks: Task[] = [];
export default function getTasks() {
   return tasks;
}
function push(task: Task) {
   tasks.push(task);
}

/**
 * Created by icastilho on 22/05/17.
 */
export class TaskLoop {

   loopService: LoopService;
   emitter: EventEmitter;


   constructor() {
      this.loopService = loopInstance();
      this.loopService.addListener('loop:insert', (loop) => this.onInsert(loop));
      this.loopService.addListener('loop:delete', (loop) => this.onDelete(loop));
   }

   start() {

      this.loopService.getAll().then((loops) => {

         async.each(loops, (loop, callback) => {
            // Perform operation on file here.
            this.execution(loop);
            callback();
         }, function(err) {
            // if any of the file processing produced an error, err would equal that error
            if (err) {
               // One of the iterations produced an error.
               // All processing will now stop.
               console.log('A loop failed to process');
            } else {
               console.log('All loop have been processed successfully');
            }
         });

      });
   }

   execution(loop: Loop) {
      console.log('Creating Loop Task : ' + loop.nome);
      const task = new Task(loop.nome, loop.delay_extra);
      task.setExecution(() => {
         this.loopService.get(loop.$loki).then((obj) => {
            // console.log(task, ' time: ' + new Date().getTime());
            if (!obj) {
               console.log(`TASK DELETED:: ${loop.nome} `);
               task.status = 'DELETED';
               return;
            }
            task.delay = obj.delay_extra;
            task.name = obj.nome;
            this.process(obj);
         });
      });
      task.run();
      tasks.push(task);
   }


   async process(loop: Loop) {

      if (loop.arquivo.match('^https?://')) {

      } else {

         fs.stat(loop.arquivo, (err, stats) => {
            if (err) {
               console.error(`PROCESS: ${loop.nome} Error red file: ${loop.arquivo} - ERROR: ${err}`);
            } else {
               console.error(`PROCESS: ${loop.nome} READING file: ${loop.arquivo} - Status: ${stats}`);

               fs.readFile(loop.arquivo, (err2, data) => {
                  if (err2) {
                     throw err2;
                  }
                  console.error(`PROCESS: ${loop.nome} FINISHED READ file: ${loop.arquivo}`);
               });
            }
         });
      }
   }

   async requestFile() {

   }

   onInsert(loop: Loop) {
      this.execution(loop);
   }

   onDelete(id: number) {
      const pos = tasks.map(elem => { return elem.id; }).indexOf(id);
      tasks.splice(pos, 1);
   }

}

