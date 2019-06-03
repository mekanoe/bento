import Bento, { BufferWithCtx, IBentoTransport, IBentoSerializer } from '.';
export default class Transport implements IBentoTransport {
    protected bento: Bento;
    serializer: IBentoSerializer;
    constructor(bento: Bento, serializer: IBentoSerializer);
    /**
     * Sender takes in a buffer, and waits for a response.
     */
    sender(data: ArrayBuffer, _: {
        service: string;
        fn: string;
    }): Promise<ArrayBuffer>;
    /**
     * Receiver takes in a buffer with ctx, and replies with a response.
     */
    receiver<C>(data: BufferWithCtx<C>): Promise<ArrayBuffer>;
}
