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
var base_service_1 = require("./base.service");
/**
 * Created by icastilho on 22/05/17.
 */
var LoopService = (function (_super) {
    __extends(LoopService, _super);
    function LoopService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoopService.prototype.getName = function () {
        return 'loop';
    };
    return LoopService;
}(base_service_1.default));
exports.LoopService = LoopService;
var service;
function loopInstance() {
    if (!service) {
        service = new LoopService();
    }
    return service;
}
exports.default = loopInstance;
//# sourceMappingURL=loop.service.js.map