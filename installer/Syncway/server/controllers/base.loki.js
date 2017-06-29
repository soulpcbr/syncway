"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Loki = require("lokijs");
var util_1 = require("util");
/**
 * Created by icastilho on 20/05/17.
 */
var DB_NAME = '.db.json';
var DB_PATH = 'data';
var BaseLokiCtrl = (function () {
    function BaseLokiCtrl() {
        var _this = this;
        /**
         * Insert
         * @param req
         * @param res
         */
        this.insert = function (req, res) {
            console.log('Insert: ', _this.getName());
            if (!req.body) {
                res.sendStatus(400);
                return;
            }
            _this.model = _this.coll.insertOne(req.body);
            _this.db.saveDatabase();
            if (util_1.isNullOrUndefined(_this.model)) {
                res.sendStatus(400);
                return;
            }
            res.status(200).json(_this.model);
        };
        /**
         * Get All
         * @param req
         * @param res
         */
        this.getAll = function (req, res) {
            res.json(_this.coll.data);
        };
        /**
         * Get One by id
         * @param req
         * @param res
         */
        this.get = function (req, res) {
            res.json(_this.coll.get(req.params.id));
        };
        /**
         * Count all
         * @param req
         * @param res
         */
        this.count = function (req, res) {
            res.json(_this.coll.data.length);
        };
        // Update by id
        this.update = function (req, res) {
            console.log("Update: " + _this.getName() + " - " + req.body.$loki);
            if (!req.body || !req.body.$loki) {
                res.sendStatus(400);
                return;
            }
            _this.coll.update(req.body);
            _this.db.saveDatabase();
            res.status(200).json(_this.model);
        };
        // Delete by id
        this.delete = function (req, res) {
            console.log("Delete " + _this.getName() + " id: " + req.params.id);
            if (!req.params.id) {
                res.sendStatus(400);
                return;
            }
            var doc = _this.coll.get(req.params.id);
            _this.coll.remove(doc);
            _this.db.saveDatabase();
            console.log("Deleted Col " + _this.getName() + " - id: " + req.body);
            res.sendStatus(200);
        };
        this.db = new Loki(DB_PATH + "/" + this.getName() + DB_NAME, {
            verbose: true,
            persistenceMethod: 'fs',
            autoload: true,
            autoloadCallback: function () { return _this.loadHandler(); }
        });
        console.log(':: Init DB ', this.getName() + DB_NAME);
    }
    BaseLokiCtrl.prototype.loadHandler = function () {
        var _this = this;
        // if database did not exist it will be empty so I will intitialize here
        this.coll = this.db.getCollection(this.getName());
        if (this.coll === null) {
            this.coll = this.db.addCollection(this.getName());
        }
        this.coll.on('error', function (err) { return console.error('Error Load Coll: ', _this.getName(), err); });
    };
    return BaseLokiCtrl;
}());
exports.default = BaseLokiCtrl;
//# sourceMappingURL=base.loki.js.map