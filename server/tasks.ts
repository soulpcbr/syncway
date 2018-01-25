import {TaskLoop} from './task/loop.task';
import {STATUS} from './task/task';

/**
 * Created by icastilho on 22/05/17.
 */

export default function setTasks(io) {

  // const nsp = io.of('/status');
  const task = new TaskLoop(io);

  io.on('connect', (socket: any) => {
    console.log('Connected client on port ');

    task.getTasks().forEach(t => {
      io.emit('status'  , {id: t.loop.$loki, status: 'CONNECTING', nextExecution: t.getDelay() + new Date().getTime() });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  setTimeout(() => {
      task.start();
   }, 3000);

}

