import {TaskLoop} from './task/loop.task';

/**
 * Created by icastilho on 22/05/17.
 */

export default function setTasks(io) {

  setTimeout(() => {
      const task = new TaskLoop(io);
      task.start();
   }, 3000);

}

