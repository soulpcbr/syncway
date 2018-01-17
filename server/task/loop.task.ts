import async from 'async';
import Loop from '../models/loop';
import {
   D_PATH,
   SyncwayFileUpload
} from '../service/fileupload.service';
import loopInstance, {LoopService} from '../service/loop.service';
import {Task, STATUS} from './task';
const fs  = require('fs-extra');

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

   io: SocketIO.Server;
   loopService: LoopService;

   constructor(io: SocketIO.Server) {
      this.io = io;
      this.loopService = loopInstance();
      this.loopService.addListener('loop:insert', (loop) => this.onInsert(loop));
      this.loopService.addListener('loop:delete', (loop) => this.onDelete(loop));
   }

   start() {

      fs.remove(D_PATH)
         .then(() => {
            console.log(`[CLEANING PATH] :: ${D_PATH}`);
         }).catch((err) => {
            console.error(`[CLEANING PATH] :: ${D_PATH} :: `, err);
         });

      this.loopService.getAll().then((loops) => {

         async.each(loops, (loop, callback) => {
            this.onInsert(loop);
            callback();
         }, (err) => {
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
            if (!obj) {
               console.log(`[TASK] ${task.loop.nome}:: DELETED`);
               task.setStatus(STATUS.DELETED);
               return;
            }
            if (task.delayType === 'extra') {
               task.delay = obj.delay_extra;
            } else {
               task.delay = obj.delay_main;
            }
            task.name = obj.nome;
            task.loop = obj;
            await this.process(task).then(_ => task.setStatus(STATUS.SLEEPING)).catch(_ => task.setStatus(STATUS.ERROR));
         });
      });
   }


   async process(task: Task): Promise<any> {

    /*  if (task.loop.pathname === '') {
         console.log('Last execution can`t delete try to delete again file: ', task.loop.pathname);
         this.deleteFile(task.loop);
      }*/
      if (task.loop.arquivo.match('^https?://') || task.loop.arquivo.match('^rtsp?://')) {
         console.log(`[PROCESS HTTP] ${task.loop.nome} :: It is http origin: ${task.loop.arquivo}`);
         return await  this.sendFile(task, task.loop)
            .then((delay) => console.log(`[PROCESS HTTP] ${task.loop.nome} 
                                                   :: FINISHED READ: ${task.loop.arquivo}`))
            .then(() => this.deleteFile(task.loop))
            .catch((err) => {
              console.log(`[PROCESS HTTP] ${task.loop.nome} ERROR:: `, err)
              throw  err;
            });
      } else {
        return fs.stat(task.loop.arquivo)
            .then((stats) => {
               if (stats.isDirectory()) {
                  this.readDir(task);
               } else if (stats.isFile()) {
                  this.sendFile(task, task.loop)
                     .then((delay) => console.log(`[PROCESS FILE] ${task.loop.nome} :: FINISHED READ: ${task.loop.arquivo}`))
                     .then(() => this.deleteFile(task.loop))
                     .catch((err2) => console.log(`[PROCESS FILE] ${task.loop.nome} ERROR:: `, err2));
               } else {
                  console.warn('It is not file or directory: ', task.loop.arquivo);
               }
            })
            .catch((err) => {
               if (err.code === 'ENOENT') {
                  console.error(`[FILE NOT FOUND]: ${task.loop.nome}: ${task.loop.arquivo} :: No such a file or directory`);
               } else {
                  console.error('[PROCESS]: ', err);
               }
               throw  err;
            });
      }
   }

   async readDir(task: Task) {
      fs.readdir(task.loop.arquivo)
         .then((files) => {
            console.log(`[PROCESS DIR] ${task.loop.nome} :: READING: ${task.loop.arquivo} - ${files.length} files inside`);
            if (files.length > 0) {
               async.each(files, (file, callback) => {
                  // const lo: Loop = JSON.parse(JSON.stringify(task.loop));
                  const lo: Loop = Object.assign({}, task.loop);
                  lo.arquivo = task.loop.arquivo + '/' + file;
                  console.log(file);
                  this.sendFile(task, lo)
                     .then(() => this.deleteFile(lo))
                     .then(callback);
               }, (errFile) => {
                  console.log(`[PROCESS DIR] ${task.loop.nome} 
               :: FINISHED READ: ${task.loop.arquivo} ${errFile ? '- With Errors!!!'  : ''}`);
               });
            }

         })
         .catch((err2) => {
            console.error(`[PROCESS DIR] ${task.loop.nome} :: ERROR READING: ${task.loop.arquivo}`);
            throw  err2;
         });
   }


   async readFile(task: Task, loop: Loop) {
      await fs.readFile(loop.arquivo, (err2, file) => {
         if (err2) {
            console.error(err2);
            console.error(`[PROCESS FILE] ${loop.nome} :: ERROR READING: ${loop.arquivo}`);
            throw err2;
         }
         console.log(`[PROCESS FILE] ${loop.nome} :: READING: ${loop.arquivo}`);
         this.sendFile(task, loop)
            .then(() => this.deleteFile(loop))
            .then(() => console.log(`[PROCESS FILE2] ${loop.nome} :: FINISHED READ: ${loop.arquivo}`))
            .catch((err) => {
              console.log(`[PROCESS FILE] ${loop.nome} ERROR:: `, err)
              throw  err;
            });
      });

   }


   async sendFile(task: Task,  loop: Loop) {
      return await SyncwayFileUpload.upload(loop).then((delayType) => {
         console.log(`[TASK] ${loop.nome} :: NEW DELAY TYPE => ${delayType}`);
         task.delayType = '' + delayType;
      });
   }

   async deleteFile(loop: Loop) {
      console.log(`[DELETING FILE] ${loop.pathname}`);

      if (loop.pathname === '') {
         console.log(`[DELETING FILE] Why enter here? :: ${loop.pathname}`);
         return;
      }
      fs.remove(loop.pathname)
         .then(() => {
            console.log(`[DELETING FILE ] Sucessfully :: ${loop.pathname}  `);
            loop.pathname = '';
         })
         .catch(err => {
            if (err && err.code === 'ENOENT') {
               // file doens't exist
               console.log(`File ${loop.pathname} doesnt exist, wont remove it.`);
            } else {
               // maybe we don't have enough permission
               console.error('[DELETING FILE] Error occurred while trying to remove file:', loop.pathname);
               console.error(err);
            }
           throw  err;
         });
   }

   onInsert(loop: Loop) {
      const task = new Task(loop);
      this.execution(task);
      task.on('onStatus', (s: any) => {
        console.log('Executed OnStatus: ', s);
        this.io.emit('status', s);
      })
      task.run();
      tasks.push(task);
   }

   onDelete(id: number) {
      const pos = tasks.map(elem => { return elem.id; }).indexOf(id);
      tasks.splice(pos, 1);
   }

}
