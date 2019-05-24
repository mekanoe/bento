"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transport {
    constructor(bento) {
        this.bento = bento;
    }
    /**
     * Sender takes in a buffer, and waits for a response.
     */
    sender(data) {
        return this.reciever({
            buffer: data,
            ctx: { type: 'inmemory' }
        });
    }
    /**
     * Reciever takes in a buffer with ctx, and replies with a response.
     */
    reciever(data) {
        return this.bento.recieveRequest(data);
    }
}
exports.default = Transport;
