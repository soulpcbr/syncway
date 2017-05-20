
import UserCtrl from './controllers/user';
import LoopCtrl from './controllers/loop';

export default function setRoutes(app) {

  const loopCtrl = new LoopCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  app.route('/api/loops').get(loopCtrl.getAll);
  app.route('/api/loop/count').get(loopCtrl.count);
  app.route('/api/loop').post(loopCtrl.insert);
  app.route('/api/loop/:id').get(loopCtrl.get);
  app.route('/api/loop/:id').put(loopCtrl.update);
  app.route('/api/loop/:id').delete(loopCtrl.delete);

  // Users
  app.route('/api/login').post(userCtrl.login);
  app.route('/api/users').get(userCtrl.getAll);
  app.route('/api/users/count').get(userCtrl.count);
  app.route('/api/user').post(userCtrl.insert);
  app.route('/api/user/:id').get(userCtrl.get);
  app.route('/api/user/:id').put(userCtrl.update);
  app.route('/api/user/:id').delete(userCtrl.delete);

}
