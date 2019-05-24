/// <reference types="node" />
import { BufferWithCtx, IBentoTransport } from './types';
import Bento from '.';
export default class Transport implements IBentoTransport {
    private bento;
    constructor(bento: Bento);
    /**
     * Sender takes in a buffer, and waits for a response.
     */
    sender(data: Buffer): Promise<Buffer>;
    /**
     * Reciever takes in a buffer with ctx, and replies with a response.
     */
    reciever<C>(data: BufferWithCtx<C>): Promise<Buffer>;
}
