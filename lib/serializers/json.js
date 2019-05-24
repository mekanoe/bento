"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        return Buffer.from(JSON.stringify(input));
    }
    deserialize(buf) {
        if (this.opts.verbose === true) {
            console.group('deserialize');
            console.log('buf', buf.toString());
            console.groupEnd();
        }
        return JSON.parse(buf.toString());
    }
    deserializeRequest(buf) {
        if (this.opts.verbose === true) {
            console.group('deserializeRequest');
            console.log('buf', Object.assign({}, buf, { buffer: buf.buffer.toString() }));
            console.groupEnd();
        }
        return Object.assign({}, JSON.parse(buf.buffer.toString()), { ctx: buf.ctx });
    }
}
exports.default = JSONSerializer;
