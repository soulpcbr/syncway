"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./controllers/user");
var loop_1 = require("./controllers/loop");
var loop_service_1 = require("./service/loop.service");
var user_service_1 = require("./service/user.service");
function setRoutes(app) {
    var loopCtrl = new loop_1.default(loop_service_1.default());
    var userCtrl = new user_1.default(user_service_1.default());
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
exports.default = setRoutes;
//# sourceMappingURL=routes.js.map