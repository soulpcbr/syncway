import async from 'async';
import {Task} from './task';
import Loop from '../models/loop';
import loopInstance, {LoopService} from '../service/loop.service';
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


   constructor() {
      this.loopService = loopInstance();
      this.loopService.addListener('loop:insert', (loop) => this.onInsert(loop));
      this.loopService.addListener('loop:delete', (loop) => this.onDelete(loop));
   }

   start() {

      this.loopService.getAll().then((loops) => {

         async.each(loops, (loop, callback) => {
            // Perform operation on file here.
            const task = new Task(loop);
            this.execution(task);
            tasks.push(task);
            task.run();
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

   execution(task: Task) {
      console.log('[TASK] Creating Loop :: ' + task.loop.nome);

      task.setExecution(async () => {
        await this.loopService.get(task.loop.$loki).then(async (obj) => {
            // console.log(task, ' time: ' + new Date().getTime());
            if (!obj) {
               console.log(`[TASK] ${task.loop.nome}:: DELETED`);
               task.status = 'DELETED';
               return;
            }
            if (task.delayType === 'extra') {
               task.delay = obj.delay_extra;
            } else {
               task.delay = obj.delay_main;
            }
            task.name = obj.nome;
            task.loop = obj;
            await this.process(task);
         });
      });
   }


   async process(task: Task) {

      if (task.loop.arquivo.match('^https?://')) {
         console.log(`[PROCESS HTTP] ${task.loop.nome} :: It is http origin: ${task.loop.arquivo}`);
         await  this.sendFile(task, task.loop).then((delay) => console.log(`[PROCESS HTTP] ${task.loop.nome} 
         :: FINISHED READ: ${task.loop.arquivo}`))
            .catch((err) => console.log('ERROR:: ', err));
      } else {

         try {
            await fs.stat(task.loop.arquivo, async (err, stats) => {
               if (err) {
                  throw err;
               }
               if (stats.isDirectory()) {
                  await this.readDir(task);
               } else if (stats.isFile()) {
                  await this.sendFile(task, task.loop).then((delay) => console.log(`[PROCESS FILE] ${task.loop.nome} 
         :: FINISHED READ: ${task.loop.arquivo}`))
                     .catch((err2) => console.log('ERROR:: ', err2));
               } else {
                  console.warn('It is not file or directory: ', task.loop.arquivo);
               }
            });
         } catch (e) {
            // Handle error
            if (e.code === 'ENOENT') {
               // no such file or directory
               console.error(`ENOENT: ${task.loop.nome}: ${task.loop.arquivo} :: No such a file or directory`);
            } else {
               // do something else
            }
         }
      }
   }

   async readDir(task: Task) {
      await fs.readdir(task.loop.arquivo, async (err2, files) => {
         if (err2) {
            console.error(`[PROCESS DIR] ${task.loop.nome} :: ERROR READING: ${task.loop.arquivo}`);
            throw err2;
         }
         console.log(`[PROCESS DIR] ${task.loop.nome} :: READING: ${task.loop.arquivo} - ${files.length} files inside`);
         if (files.length > 0) {
            await async.each(files, async (file, callback) => {
               const lo: Loop = Object.assign({}, task.loop);
               lo.arquivo = task.loop.arquivo + '/' + file;
               console.log(file);
               await this.sendFile(task, lo).then(callback);
            }, (errFile) => {
               console.log(`[PROCESS DIR] ${task.loop.nome} 
               :: FINISHED READ: ${task.loop.arquivo} ${errFile ? '- With Errors!!!'  : ''}`);
            });
         }

      });
   }

/*
   async readFile(task: Task, loop: Loop) {
      await fs.readFile(loop.arquivo, (err2, file) => {
         if (err2) {
            console.error(err2)
            console.error(`[PROCESS FILE] ${loop.nome} :: ERROR READING: ${loop.arquivo}`);
            throw err2;
         }
         console.log(`[PROCESS FILE] ${loop.nome} :: READING: ${loop.arquivo}`);
         this.sendFile(task, loop).then(() => console.log(`[PROCESS FILE] ${loop.nome} :: FINISHED READ: ${loop.arquivo}`))
            .catch((err) => console.log('ERROR:: ', err));

      });

   }
*/

   async sendFile(task: Task,  loop: Loop) {
      return await SyncwayFileUpload.upload(loop).then((delayType) => {
         console.log(`[TASK] ${loop.nome} :: NEW DELAY TYPE => ${delayType}`);
         task.delayType = '' + delayType;
      });
   }

   onInsert(loop: Loop) {
      const task = new Task(loop);
      this.execution(task);
      tasks.push(task);
   }

   onDelete(id: number) {
      const pos = tasks.map(elem => { return elem.id; }).indexOf(id);
      tasks.splice(pos, 1);
   }

}
