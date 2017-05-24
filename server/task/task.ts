import Loop from '../models/loop';
/**
 * Created by icastilho on 22/05/17.
 */

export class Task {

   id: number;
   name: string;
   delay: number;
   execution: any;
   status = 'SLEEPING';
   loop: Loop;
   delayType: string;

   constructor(loop: Loop) {
      this.name = loop.nome;
      this.delay = loop.delay_main;
      this.loop = loop;
      this.delayType = 'main';
   }

   async run() {
      console.log(`[TASK] ${this.name} :: ${this.status} ... Delay: ${this.getDelay()}` );

      setTimeout(async () => {
         if (this.status === 'DELETED') {
            return;
         } else if (this.status === 'SLEEPING') {
            this.status = 'WAKING-UP';
            console.log(`[TASK] ${this.name} :: ${this.status}`);
            await this.execution();
            this.status = 'SLEEPING';
            this.run();
         } else {
            this.run();
         }
      }, this.getDelay());
   }

   setDelay(delay) {
      this.delay = delay;
   }

   getDelay() {
      return this.delay;
   }

   setExecution(execution: any) {
      this.execution = execution;
   }

}
