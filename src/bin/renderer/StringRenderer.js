"use strict";
exports.__esModule = true;
var StringRenderer = /** @class */ (function () {
    function StringRenderer() {
        var _this = this;
        this._data = '';
        this.r = function (str) {
            _this._data += str + "\n";
        };
        this.data = function () {
            return _this._data;
        };
    }
    return StringRenderer;
}());
exports["default"] = StringRenderer;
