"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("async");
var task_1 = require("./task");
var loop_service_1 = require("../service/loop.service");
var tasks = [];
function getTasks() {
    return tasks;
}
exports.default = getTasks;
function push(task) {
    tasks.push(task);
}
/**
 * Created by icastilho on 22/05/17.
 */
var TaskLoop = (function () {
    function TaskLoop() {
        var _this = this;
        this.loopService = loop_service_1.default();
        this.loopService.addListener('loop:insert', function (loop) { return _this.onInsert(loop); });
        this.loopService.addListener('loop:delete', function (loop) { return _this.onDelete(loop); });
    }
    TaskLoop.prototype.start = function () {
        var _this = this;
        this.loopService.getAll().then(function (loops) {
            async_1.default.each(loops, function (loop, callback) {
                // Perform operation on file here.
                _this.execution(loop);
                callback();
            }, function (err) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A loop failed to process');
                }
                else {
                    console.log('All loop have been processed successfully');
                }
            });
        });
    };
    TaskLoop.prototype.execution = function (loop) {
        var _this = this;
        console.log('Creating Loop Task : ' + loop.nome);
        var task = new task_1.Task(loop.nome, loop.delay_extra);
        task.setExecution(function () {
            _this.loopService.get(loop.$loki).then(function (obj) {
                console.log(task, ' time: ' + new Date().getTime());
                if (!obj) {
                    console.log("TASK DELETED:: " + loop.nome + " ");
                    task.status = 'DELETED';
                    return;
                }
                task.delay = obj.delay_extra;
                task.name = obj.nome;
            });
        });
        task.run();
        tasks.push(task);
    };
    TaskLoop.prototype.onInsert = function (loop) {
        this.execution(loop);
    };
    TaskLoop.prototype.onDelete = function (id) {
        var pos = tasks.map(function (elem) { return elem.id; }).indexOf(id);
        tasks.splice(pos, 1);
    };
    return TaskLoop;
}());
exports.TaskLoop = TaskLoop;
//# sourceMappingURL=task.service.js.map