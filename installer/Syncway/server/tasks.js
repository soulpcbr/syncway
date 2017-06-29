"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loop_task_1 = require("./task/loop.task");
/**
 * Created by icastilho on 22/05/17.
 */
function setTasks(app) {
    setTimeout(function () {
        var task = new loop_task_1.TaskLoop();
        task.start();
    }, 3000);
}
exports.default = setTasks;
//# sourceMappingURL=tasks.js.map