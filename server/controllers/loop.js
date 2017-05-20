"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require("./base");
var Loop_1 = require("../models/Loop");
/**
 * Created by icastilho on 19/05/17.
 */
var LoopCtrl = (function (_super) {
    __extends(LoopCtrl, _super);
    function LoopCtrl() {
        _super.apply(this, arguments);
        this.model = Loop_1.default;
        this.login = function (req, res) {
            console.log(req.body.loop);
            if (!req.body.loop)
                return res.sendStatus(403);
            return res.sendStatus(200).json({ message: "Success OK" });
        };
    }
    return LoopCtrl;
}(base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoopCtrl;
