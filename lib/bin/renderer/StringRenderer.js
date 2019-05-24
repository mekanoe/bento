"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringRenderer {
    constructor() {
        this._data = '';
        this.r = (str) => {
            this._data += `${str}\n`;
        };
        this.data = () => {
            return this._data;
        };
    }
}
exports.default = StringRenderer;
