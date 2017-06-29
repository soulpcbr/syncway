"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_service_1 = require("./service/task.service");
var loop_service_1 = require("../client/app/services/loop.service");
/**
 * Created by icastilho on 22/05/17.
 */
function setTasks(app) {
    setTimeout(function () {
        var task = new task_service_1.TaskService(loop_service_1.LoopService.service);
        task.start();
    }, 3000);
}
exports.default = setTasks;
//# sourceMappingURL=tasks.js.map