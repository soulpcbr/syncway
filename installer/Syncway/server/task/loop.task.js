"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("async");
var task_1 = require("./task");
var loop_service_1 = require("../service/loop.service");
var fileupload_service_1 = require("../service/fileupload.service");
var fs = require('fs');
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
                var task = new task_1.Task(loop);
                _this.execution(task);
                tasks.push(task);
                task.run();
                callback();
            }, function (err) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A loop failed to process');
                }
                else {
                    // console.log('All loop have been processed successfully');
                }
            });
        });
    };
    TaskLoop.prototype.execution = function (task) {
        var _this = this;
        console.log('[TASK] Creating Loop :: ' + task.loop.nome);
        task.setExecution(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loopService.get(task.loop.$loki).then(function (obj) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // console.log(task, ' time: ' + new Date().getTime());
                                        if (!obj) {
                                            console.log("[TASK] " + task.loop.nome + ":: DELETED");
                                            task.status = 'DELETED';
                                            return [2 /*return*/];
                                        }
                                        if (task.delayType === 'extra') {
                                            task.delay = obj.delay_extra;
                                        }
                                        else {
                                            task.delay = obj.delay_main;
                                        }
                                        task.name = obj.nome;
                                        task.loop = obj;
                                        return [4 /*yield*/, this.process(task)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TaskLoop.prototype.process = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!task.loop.arquivo.match('^https?://')) return [3 /*break*/, 2];
                        console.log("[PROCESS HTTP] " + task.loop.nome + " :: It is http origin: " + task.loop.arquivo);
                        return [4 /*yield*/, this.sendFile(task, task.loop).then(function (delay) { return console.log("[PROCESS HTTP] " + task.loop.nome + " \n         :: FINISHED READ: " + task.loop.arquivo); })
                                .then(function () { return _this.deleteFile(task.loop); })
                                .catch(function (err) { return console.log('ERROR:: ', err); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.stat(task.loop.arquivo, function (err, stats) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err) {
                                                console.log("[FILE NOT FOUND] " + task.loop.nome + " ::  " + task.loop.arquivo);
                                                return [2 /*return*/];
                                            }
                                            if (!stats.isDirectory()) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.readDir(task)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 2:
                                            if (!stats.isFile()) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.sendFile(task, task.loop).then(function (delay) { return console.log("[PROCESS FILE] " + task.loop.nome + " \n         :: FINISHED READ: " + task.loop.arquivo); }).then(function () { return _this.deleteFile(task.loop); })
                                                    .catch(function (err2) { return console.log('ERROR:: ', err2); })];
                                        case 3:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            console.warn('It is not file or directory: ', task.loop.arquivo);
                                            _a.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        // Handle error
                        if (e_1.code === 'ENOENT') {
                            // no such file or directory
                            console.error("ENOENT: " + task.loop.nome + ": " + task.loop.arquivo + " :: No such a file or directory");
                        }
                        else {
                            // do something else
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TaskLoop.prototype.readDir = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.readdir(task.loop.arquivo, function (err2, files) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err2) {
                                            console.error("[PROCESS DIR] " + task.loop.nome + " :: ERROR READING: " + task.loop.arquivo);
                                            throw err2;
                                        }
                                        console.log("[PROCESS DIR] " + task.loop.nome + " :: READING: " + task.loop.arquivo + " - " + files.length + " files inside");
                                        if (!(files.length > 0)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, async_1.default.each(files, function (file, callback) { return __awaiter(_this, void 0, void 0, function () {
                                                var _this = this;
                                                var lo;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            lo = Object.assign({}, task.loop);
                                                            lo.arquivo = task.loop.arquivo + '/' + file;
                                                            console.log(file);
                                                            return [4 /*yield*/, this.sendFile(task, lo)
                                                                    .then(function () { return _this.deleteFile(task.loop); })
                                                                    .then(callback)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }, function (errFile) {
                                                console.log("[PROCESS DIR] " + task.loop.nome + " \n               :: FINISHED READ: " + task.loop.arquivo + " " + (errFile ? '- With Errors!!!' : ''));
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskLoop.prototype.readFile = function (task, loop) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.readFile(loop.arquivo, function (err2, file) {
                            if (err2) {
                                console.error(err2);
                                console.error("[PROCESS FILE] " + loop.nome + " :: ERROR READING: " + loop.arquivo);
                                throw err2;
                            }
                            console.log("[PROCESS FILE] " + loop.nome + " :: READING: " + loop.arquivo);
                            _this.sendFile(task, loop)
                                .then(function () { return _this.deleteFile(loop); })
                                .then(function () { return console.log("[PROCESS FILE2] " + loop.nome + " :: FINISHED READ: " + loop.arquivo); })
                                .catch(function (err) { return console.log('ERROR:: ', err); });
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskLoop.prototype.sendFile = function (task, loop) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fileupload_service_1.SyncwayFileUpload.upload(loop).then(function (delayType) {
                            console.log("[TASK] " + loop.nome + " :: NEW DELAY TYPE => " + delayType);
                            task.delayType = '' + delayType;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TaskLoop.prototype.deleteFile = function (loop) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("[DELETING FILE] " + loop.arquivo);
                        return [4 /*yield*/, fs.unlink(loop.arquivo, function (err) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (err && err.code === 'ENOENT') {
                                        // file doens't exist
                                        console.log("File " + loop.arquivo + " doesnt exist, wont remove it.");
                                    }
                                    else if (err) {
                                        // maybe we don't have enough permission
                                        console.error('[DELETING FILE] Error occurred while trying to remove file:', loop.arquivo);
                                    }
                                    else {
                                        console.log("[DELETING FILE] " + loop.arquivo + " Sucessfully ");
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TaskLoop.prototype.onInsert = function (loop) {
        var task = new task_1.Task(loop);
        this.execution(task);
        tasks.push(task);
        task.run();
    };
    TaskLoop.prototype.onDelete = function (id) {
        var pos = tasks.map(function (elem) { return elem.id; }).indexOf(id);
        tasks.splice(pos, 1);
    };
    return TaskLoop;
}());
exports.TaskLoop = TaskLoop;
//# sourceMappingURL=loop.task.js.map