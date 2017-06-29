"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var CatCtrl = (function (_super) {
    __extends(CatCtrl, _super);
    function CatCtrl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // model = Cat;
    CatCtrl.prototype.getName = function () {
        return 'cat';
    };
    return CatCtrl;
}(base_1.default));
exports.default = CatCtrl;
//# sourceMappingURL=cat.js.map