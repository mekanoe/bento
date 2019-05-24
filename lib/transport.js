"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transport {
    constructor(bento, serializer) {
        this.bento = bento;
        this.serializer = serializer;
    }
    /**
     * Sender takes in a buffer, and waits for a response.
     */
    sender(data) {
        return this.receiver({
            buffer: data,
            ctx: { type: 'inmemory' }
        });
    }
    /**
     * Receiver takes in a buffer with ctx, and replies with a response.
     */
    receiver(data) {
        return this.bento.receiveRequest(data, this.serializer);
    }
}
exports.default = Transport;
