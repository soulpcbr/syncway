"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
/**
 * Created by icastilho on 20/05/17.
 */
var BaseCtrl = (function () {
    function BaseCtrl(s) {
        var _this = this;
        /**
         * Insert
         * @param req
         * @param res
         */
        this.insert = function (req, res) {
            console.log('Insert: ', _this.service.getName());
            if (!req.body) {
                res.sendStatus(400);
                return;
            }
            _this.service.insert(req.body).then(function (value) {
                if (util_1.isNullOrUndefined(value)) {
                    res.sendStatus(400);
                    return;
                }
                res.status(200).json(value);
            });
        };
        /**
         * Get All
         * @param req
         * @param res
         */
        this.getAll = function (req, res) {
            _this.service.getAll().then(function (obj) { return res.json(obj); });
        };
        /**
         * Get One by id
         * @param req
         * @param res
         */
        this.get = function (req, res) {
            _this.service.get(req.params.id).then(function (obj) { return res.json(obj); });
        };
        /**
         * Count all
         * @param req
         * @param res
         */
        this.count = function (req, res) {
            _this.service.count().then(function (length) { return res.json(length); });
        };
        // Update by id
        this.update = function (req, res) {
            console.log("Update: " + _this.service.getName() + " - " + req.body.$loki);
            if (!req.body || !req.body.$loki) {
                res.sendStatus(400);
                return;
            }
            _this.service.update(req.body).then(function (obj) { return res.status(200).json(obj); });
        };
        // Delete by id
        this.delete = function (req, res) {
            console.log("Delete " + _this.service.getName() + " id: " + req.params.id);
            if (!req.params.id) {
                res.sendStatus(400);
                return;
            }
            _this.service.get(req.params.id).then(function (doc) {
                _this.service.delete(doc).then(function (value) {
                    if (value) {
                        res.sendStatus(200);
                    }
                    else {
                        res.sendStatus(400);
                    }
                });
            });
        };
        this.service = s;
    }
    return BaseCtrl;
}());
exports.default = BaseCtrl;
//# sourceMappingURL=base.js.map