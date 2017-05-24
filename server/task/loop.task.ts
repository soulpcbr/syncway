import async from 'async';
import {Task} from './task';
import Loop from '../models/loop';
import loopInstance, {LoopService} from '../service/loop.service';
import {EventEmitter} from 'events';
import {SyncwayFileUpload} from '../service/fileupload.service';
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
               // console.log('All loop have been processed successfully');
            }
         });

      });
   }

   execution(loop: Loop) {
      console.log('[TASK] Creating Loop :: ' + loop.nome);
      const task = new Task(loop.nome, loop.delay_extra);
      task.setExecution(() => {
         this.loopService.get(loop.$loki).then((obj) => {
            // console.log(task, ' time: ' + new Date().getTime());
            if (!obj) {
               console.log(`[TASK] ${loop.nome}:: DELETED`);
               task.status = 'DELETED';
               return;
            }
            task.delay = obj.delay_main ?  obj.delay_main : obj.delay_extra;
            task.name = obj.nome;
            this.process(obj);
         });
      });
      task.run();
      tasks.push(task);
   }


   async process(loop: Loop) {

      if (loop.arquivo.match('^https?://')) {
         console.log(`[PROCESS HTTP] ${loop.nome} :: It is http origin: ${loop.arquivo}`);
         this.sendFile(loop).then((delay) => console.log(`[PROCESS HTTP] ${loop.nome} :: FINISHED READ: ${loop.arquivo}`))
            .catch((err) => console.log('ERROR:: ', err));
      } else {

         try {
           fs.stat(loop.arquivo, (err, stats) => {
               if (err) {
                  throw err;
               }
               if (stats.isDirectory()) {
                  this.readDir(loop);
               } else if (stats.isFile()) {
                  this.readFile(loop);
               } else {
                  console.warn('It is not file or directory: ', loop.arquivo);
               }
            });
         } catch (e) {
            // Handle error
            if (e.code === 'ENOENT') {
               // no such file or directory
               console.error(`ENOENT: ${loop.nome}: ${loop.arquivo} :: No such a file or directory`);
            } else {
               // do something else
            }
         }
      }
   }

   async readDir(loop) {
      fs.readdir(loop.arquivo, (err2, files) => {
         if (err2) {
            console.error(`[PROCESS DIR] ${loop.nome} :: ERROR READING: ${loop.arquivo}`);
            throw err2;
         }
         console.log(`[PROCESS DIR] ${loop.nome} :: READING: ${loop.arquivo} - ${files.length} files inside`);
         if (files.length > 0) {
            async.each(files, async (file, callback) => {
               const lo: Loop = Object.assign({}, loop);
               lo.arquivo = loop.arquivo + '/' + file;
               console.log(file);
               this.readFile(lo).then(callback);
            }, (errFile) => {
               console.log(`[PROCESS DIR] ${loop.nome} :: FINISHED READ: ${loop.arquivo} ${errFile ? '- With Errors!!!'  : ''}`, errFile);
            });
         }

      });
   }

   async readFile(loop) {
      await fs.readFile(loop.arquivo, (err2, file) => {
         if (err2) {
            console.error(err2)
            console.error(`[PROCESS FILE] ${loop.nome} :: ERROR READING: ${loop.arquivo}`);
            throw err2;
         }
         console.log(`[PROCESS FILE] ${loop.nome} :: READING: ${loop.arquivo}`);
         this.sendFile(loop).then(() => console.log(`[PROCESS FILE] ${loop.nome} :: FINISHED READ: ${loop.arquivo}`))
            .catch((err) => console.log('ERROR:: ', err));

      });

   }

   async sendFile(loop) {
      return SyncwayFileUpload.upload(loop).then((newDelay) => {
         console.log(`[TASK] ${loop.nome} :: NEW DELAY => ${newDelay}`);
         loop.delay_main = newDelay;
         this.loopService.update(loop);
      });
   }

   onInsert(loop: Loop) {
      this.execution(loop);
   }

   onDelete(id: number) {
      const pos = tasks.map(elem => { return elem.id; }).indexOf(id);
      tasks.splice(pos, 1);
   }

}
