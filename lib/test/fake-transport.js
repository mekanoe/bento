"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("../transport"));
const __1 = require("..");
const evt = {
    send: (data) => {
        if (evt._rcv === undefined) {
            throw new Error('oops');
        }
        return evt._rcv.receiver({ buffer: data, ctx: { env: 'testing' } });
    }
};
class InMemoryTransport extends transport_1.default {
    sender(data) {
        return evt.send(data);
    }
}
exports.InMemoryTransport = InMemoryTransport;
exports.createClient = (b) => {
    evt._snd = new InMemoryTransport(b, new __1.JSONSerializer());
    return evt._snd;
};
exports.createServer = (b) => {
    evt._rcv = new InMemoryTransport(b, new __1.JSONSerializer());
    return evt._rcv;
};
