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
var fetch = require('node-fetch');
var FormData = require('form-data');
var populate = require('form-data/lib/populate');
var request = require('request');
var parseUrl = require('url').parse;
/**
 * Created by icastilho on 23/05/17.
 */
var SyncwayFileUpload = (function () {
    function SyncwayFileUpload() {
    }
    SyncwayFileUpload.upload = function (loop) {
        return __awaiter(this, void 0, void 0, function () {
            var form, obj_1, keys, params_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Upload:', loop.arquivo);
                        form = new FormData();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (loop.arquivo.match('^https?://')) {
                            console.log('Upload2:');
                            request(loop.arquivo, function (error, response, body) {
                                if (error) {
                                    console.log('error:', error); // Print the error if one occurred
                                }
                                console.log('[GET IMAGE] statusCode:', response && response.statusCode);
                                console.log('[GET IMAGE] content-type:', response.headers['content-type']);
                                form.append('fileToUpload', body);
                            });
                            console.log('Upload3:');
                        }
                        else {
                            form.append('fileToUpload', fs_1.createReadStream(loop.arquivo));
                        }
                        if (!loop.data) return [3 /*break*/, 3];
                        obj_1 = JSON.parse(loop.data);
                        keys = Object.keys(obj_1);
                        return [4 /*yield*/, keys.forEach(function (key, index, array) {
                                form.append(key, obj_1[key]);
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        params_1 = parseUrl(loop.api);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                form.submit({
                                    port: params_1.port,
                                    path: params_1.pathname,
                                    host: params_1.hostname,
                                    method: loop.method.toLowerCase(),
                                }, function (err, res) {
                                    if (err) {
                                        reject(err);
                                    }
                                    if (!/^application\/json/.test(res.headers['content-type'])) {
                                        reject(new Error("Invalid content-type.\n" +
                                            ("Expected application/json but received " + res.headers['content-type'])));
                                    }
                                    if (res) {
                                        var rawData_1 = '';
                                        res.on('data', function (chunk) {
                                            rawData_1 += chunk;
                                        });
                                        res.on('end', function () {
                                            try {
                                                var parsedData = JSON.parse(rawData_1);
                                                resolve(parsedData.delay);
                                            }
                                            catch (e) {
                                                console.error(e.message);
                                                reject();
                                            }
                                        });
                                    }
                                });
                            })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        err_1 = _a.sent();
                        throw err_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return SyncwayFileUpload;
}());
exports.SyncwayFileUpload = SyncwayFileUpload;
//# sourceMappingURL=fileupload.service.js.map