"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by icastilho on 22/05/17.
 */
var RoutineService = (function () {
    function RoutineService(loopService) {
        this.loopService = loopService;
    }
    RoutineService.prototype.start = function () {
        var _this = this;
        this.loopService.getAll().then(function (loops) {
            // this.queue = Object.assign(loops);
            /* async.forever(
                function(next) {
                   // next is suitable for passing to things that need a callback(err [, whatever]);
                   // it will result in this function being called again.
                },
                function(err) {
                   // if next is called with a value in its first parameter, it will appear
                   // in here as 'err', and execution will stop.
                }
             );*/
            // create a queue object with concurrency 2
            _this.queue = async.queue(function (task, callback) {
                console.log('hello ' + task.name);
                callback();
            }, 2);
        });
        // assign a callback
        this.queue.drain = function () {
            console.log('all items have been processed');
        };
        // add some items to the queue
        this.queue.push({ name: 'foo' }, function (err) {
            console.log('finished processing foo');
        });
        this.queue.push({ name: 'bar' }, function (err) {
            console.log('finished processing bar');
        });
        // add some items to the queue (batch-wise)
        this.queue.push([{ name: 'baz' }, { name: 'bay' }, { name: 'bax' }], function (err) {
            console.log('finished processing item');
        });
        // add some items to the front of the queue
        this.queue.unshift({ name: 'bar' }, function (err) {
            console.log('finished processing bar');
        });
    };
    return RoutineService;
}());
//# sourceMappingURL=routine.service.js.map