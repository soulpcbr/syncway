/**
 * Created by icastilho on 22/05/17.
 */

export class Task {

   id: number;
   name: string;
   delay: number;
   execution: any;
   status = 'SLEEPING';

   constructor(name: string, delay: number) {
      this.name = name;
      this.delay = delay;
   }

   async run() {
      console.log(`[TASK] ${this.name} :: ${this.status} ... Delay: ${this.delay}` );

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
      }, this.delay);
   }

   setExecution(execution: any) {
      this.execution = execution;
   }

}
