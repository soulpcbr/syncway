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
var fs_1 = require("fs");
var FormData = require('form-data');
var fs = require('fs');
var http = require('http');
var download = require('image-downloader');
var parseUrl = require('url').parse;
/**
 * Created by icastilho on 23/05/17. */
exports.D_PATH = 'download/';
var SyncwayFileUpload = (function () {
    function SyncwayFileUpload() {
    }
    SyncwayFileUpload.upload = function (loop) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("[FILE UPLOAD] " + loop.nome + " :: " + loop.arquivo);
                        return [4 /*yield*/, this.createForm(loop)
                                .then(function (form) { return _this.submitFile(form, loop); })
                                .catch(function (err) {
                                console.error("[FILE UPLOAD] " + loop.nome + " UNESPECTED ERROR:: ", err.message);
                                throw err;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncwayFileUpload.createForm = function (loop) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var form, obj_1, keys, pathname, filename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        form = new FormData();
                        if (loop.data) {
                            obj_1 = JSON.parse(loop.data);
                            keys = Object.keys(obj_1);
                            keys.forEach(function (key, index, array) {
                                form.append(key, obj_1[key]);
                            });
                        }
                        if (!loop.arquivo.match('^https?://')) return [3 /*break*/, 2];
                        if (!fs.existsSync("" + exports.D_PATH)) {
                            fs.mkdirSync("" + exports.D_PATH);
                        }
                        pathname = new Date().getTime();
                        fs.mkdirSync("" + exports.D_PATH + pathname);
                        return [4 /*yield*/, this.downloadIMG({
                                url: loop.arquivo,
                                dest: exports.D_PATH + pathname,
                            })];
                    case 1:
                        filename = _a.sent();
                        loop.pathname = exports.D_PATH + pathname;
                        form.append('fileToUpload', fs_1.createReadStream(filename));
                        resolve(form);
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('else');
                        form.append('fileToUpload', fs_1.createReadStream(loop.arquivo));
                        loop.pathname = loop.arquivo;
                        resolve(form);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    SyncwayFileUpload.downloadIMG = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, filename, image, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log("[DOWNLOADING FILE]  :: " + options.url);
                        return [4 /*yield*/, download.image(options)];
                    case 1:
                        _a = _b.sent(), filename = _a.filename, image = _a.image;
                        return [2 /*return*/, filename];
                    case 2:
                        e_1 = _b.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncwayFileUpload.submitFile = function (form, loop) {
        return new Promise(function (resolve, reject) {
            var params = parseUrl(loop.api);
            form.submit({
                port: params.port,
                path: params.pathname,
                host: params.hostname,
                method: loop.method.toLowerCase(),
            }, function (err, res) {
                if (err) {
                    reject(err);
                }
                if (!/^application\/json/.test(res.headers['content-type'])) {
                    console.error("Invalid content-type.\n Expected application/json but received " + res.headers['content-type']);
                }
                if (res) {
                    var rawData_1 = '';
                    res.on('data', function (chunk) {
                        rawData_1 += chunk;
                    });
                    res.on('end', function () {
                        try {
                            console.log("[FILE UPLOAD] " + loop.nome + " Response::", rawData_1);
                            var parsedData = JSON.parse(rawData_1);
                            resolve(parsedData.delay);
                        }
                        catch (e) {
                            console.error("[FILE UPLOAD] " + loop.nome + " ERROR:: ", e);
                            reject(e);
                        }
                    });
                }
            });
        });
    };
    return SyncwayFileUpload;
}());
exports.SyncwayFileUpload = SyncwayFileUpload;
//# sourceMappingURL=fileupload.service.js.map