import {TaskLoop} from './task/loop.task';

/**
 * Created by icastilho on 22/05/17.
 */

export default function setTasks(io) {

  const nsp = io.of('/status');

  nsp.on('connect', (socket: any) => {
    console.log('Connected client on port %s.');
    socket.on('status', (s: any) => {
      console.log('[loop](status): %s', JSON.stringify(s));
      nsp.emit('status', s);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  setTimeout(() => {
      const task = new TaskLoop(io);
      task.start();
   }, 3000);

}

