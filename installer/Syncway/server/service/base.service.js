"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Loki = require("lokijs");
var chokidar = require("chokidar");
var events_1 = require("events");
var fs = require("fs");
/**
 * Created by icastilho on 22/05/17.
 */
var DB_NAME = '.db.json';
var DB_PATH = 'data';
var BaseService = (function () {
    function BaseService() {
        var _this = this;
        /**
         * Insert
         * @param req
         * @param res
         */
        this.insert = function (obj) {
            console.log('Insert: ', _this.getName());
            _this.stopwatch();
            return new Promise(function (resolve, reject) {
                _this.beforSave(obj).then(function (data) {
                    _this.model = _this.coll.insertOne(data);
                    _this.db.saveDatabase();
                    resolve(_this.model);
                    _this.addWatch();
                    _this.emitter.emit(_this.getName() + ":insert", _this.model);
                });
            });
        };
        /**
         * Get All
         * @param req
         * @param res
         */
        this.getAll = function () {
            return Promise.resolve(_this.coll.data);
        };
        /**
         * Get One by id
         * @param req
         * @param res
         */
        this.get = function (id) {
            return Promise.resolve(_this.coll.get(id));
        };
        this.findOne = function (param) {
            var data = _this.coll.findOne(param);
            return Promise.resolve(data);
        };
        /**
         * Count all
         * @param req
         * @param res
         */
        this.count = function () {
            return Promise.resolve(_this.coll.data.length);
        };
        // Update by id
        this.update = function (obj) {
            _this.stopwatch();
            _this.coll.update(obj);
            _this.db.saveDatabase();
            setTimeout(function () { return _this.addWatch(); }, 300);
            return Promise.resolve(_this.model);
        };
        // Delete by id
        this.delete = function (doc) {
            var id = doc.$loki;
            _this.stopwatch();
            console.log("Deleting Col " + _this.getName() + " - id: " + id);
            _this.coll.remove(doc);
            _this.db.saveDatabase();
            _this.addWatch();
            _this.emitter.emit(_this.getName() + ":delete", id);
            return Promise.resolve(true);
        };
        fs.existsSync("" + DB_PATH) || fs.mkdirSync("" + DB_PATH);
        this.db = new Loki(DB_PATH + "/" + this.getName() + DB_NAME, {
            verbose: true,
            persistenceMethod: 'fs',
            autoload: true,
            autoloadCallback: function () { return _this.loadHandler(); }
        });
        this.emitter = new events_1.EventEmitter();
        console.log(':: Init DB ', this.getName() + DB_NAME);
    }
    BaseService.prototype.loadHandler = function () {
        var _this = this;
        // if database did not exist it will be empty so I will intitialize here
        this.loadCollection(function () { });
        this.watcher = chokidar.watch(DB_PATH + "/" + this.getName() + DB_NAME, { ignored: /(^|[\/\\])\../, interval: 1 });
        this.watcher.on('change', function (path) {
            console.log("File " + path + " has been changed");
            _this.db.loadDatabase({}, function () {
                console.log('reload: ', _this.getName());
                _this.coll = _this.db.getCollection(_this.getName());
            });
            _this.stopwatch();
            _this.addWatch();
        });
    };
    BaseService.prototype.stopwatch = function () {
        this.watcher.unwatch(DB_PATH + "/" + this.getName() + DB_NAME);
    };
    BaseService.prototype.addWatch = function () {
        this.watcher.add(DB_PATH + "/" + this.getName() + DB_NAME);
    };
    BaseService.prototype.loadCollection = function (callback) {
        var _this = this;
        console.log('LoadCollection:', this.getName());
        this.coll = this.db.getCollection(this.getName());
        if (this.coll === null) {
            this.coll = this.db.addCollection(this.getName(), this.getCollectionOption());
        }
        this.coll.on('error', function (err) { return console.error('Error Load Coll: ', _this.getName(), err); });
        this.coll.on('insert', function (value) { return console.log('Inset Coll: ', _this.getName(), value); });
        callback();
    };
    /**
     * Function to execute before save
     * @returns {Promise<boolean>}
     */
    BaseService.prototype.beforSave = function (data) {
        return Promise.resolve(data);
    };
    BaseService.prototype.getCollectionOption = function () {
        return {};
    };
    /**
     * Add listener to service event
     * @param name
     * @param callback
     */
    BaseService.prototype.addListener = function (name, callback) {
        this.emitter.on(name, callback);
    };
    return BaseService;
}());
exports.default = BaseService;
function service(s) {
    var service;
    if (!service) {
        service = new s();
    }
    return service;
}
exports.service = service;
//# sourceMappingURL=base.service.js.map