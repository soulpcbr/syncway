"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var LoopService = (function () {
    function LoopService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
    }
    LoopService.prototype.getLoops = function () {
        return this.http.get('/api/loops').map(function (res) { return res.json(); });
    };
    LoopService.prototype.countLoops = function () {
        return this.http.get('/api/loops/count').map(function (res) { return res.json(); });
    };
    LoopService.prototype.addLoop = function (loop) {
        console.log(JSON.stringify(loop));
        return this.http.post('/api/loop', JSON.stringify(loop), this.options);
    };
    LoopService.prototype.getLoop = function (loop) {
        return this.http.get("/api/loop/" + loop.$loki).map(function (res) { return res.json(); });
    };
    LoopService.prototype.editLoop = function (loop) {
        return this.http.put("/api/loop/" + loop.$loki, JSON.stringify(loop), this.options);
    };
    LoopService.prototype.deleteLoop = function (loop) {
        return this.http.delete("/api/loop/" + loop.$loki, this.options);
    };
    return LoopService;
}());
LoopService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], LoopService);
exports.LoopService = LoopService;
//# sourceMappingURL=loop.service.js.map