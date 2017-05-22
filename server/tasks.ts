import {TaskLoop} from './task/loop.task';

/**
 * Created by icastilho on 22/05/17.
 */

export default function setTasks(app) {

   setTimeout(() => {
      const task = new TaskLoop();
      task.start();
   }, 3000);

}

