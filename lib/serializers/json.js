"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enc = new TextEncoder();
const dec = new TextDecoder();
class JSONSerializer {
    constructor(opts = { verbose: false }) {
        this.opts = opts;
    }
    serialize(input) {
        if (this.opts.verbose === true) {
            console.group('serialize');
            console.log('input', input);
            console.groupEnd();
        }
        return enc.encode(JSON.stringify(input));
    }
    deserialize(buf) {
        if (this.opts.verbose === true) {
            console.group('deserialize');
            console.log('buf', dec.decode(buf));
            console.groupEnd();
        }
        return JSON.parse(dec.decode(buf));
    }
    deserializeRequest(buf) {
        if (this.opts.verbose === true) {
            console.group('deserializeRequest');
            console.log('buf', Object.assign({}, buf, { buffer: dec.decode(buf.buffer) }));
            console.groupEnd();
        }
        return Object.assign({}, JSON.parse(dec.decode(buf.buffer)), { ctx: buf.ctx });
    }
}
exports.default = JSONSerializer;
