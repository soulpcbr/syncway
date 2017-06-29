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
var bcrypt = require("bcryptjs");
var base_service_1 = require("./base.service");
/**
 * Created by icastilho on 22/05/17.
 */
var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.comparePassword = function (candidatePassword, password, callback) {
            bcrypt.compare(candidatePassword, password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }
                callback(null, isMatch);
            });
        };
        return _this;
    }
    UserService.prototype.getName = function () {
        return 'user';
    };
    UserService.prototype.beforSave = function (data) {
        return new Promise(function (resolve, reject) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    return reject(err);
                }
                bcrypt.hash(data.password, salt, function (error, hash) {
                    if (error) {
                        return reject(error);
                    }
                    data.password = hash;
                    return resolve(data);
                });
            });
        });
    };
    ;
    return UserService;
}(base_service_1.default));
exports.UserService = UserService;
var service;
function userService() {
    if (!service) {
        service = new UserService();
    }
    return service;
}
exports.default = userService;
//# sourceMappingURL=user.service.js.map