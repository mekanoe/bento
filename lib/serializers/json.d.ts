/// <reference types="node" />
import { IBentoSerializer, BentoRequestData, BentoResponseData, BufferWithCtx } from '../types';
export default class JSONSerializer implements IBentoSerializer {
    private opts;
    constructor(opts?: {
        verbose: boolean;
    });
    serialize<I>(input: BentoRequestData<I, null> | BentoResponseData<I>): Buffer;
    deserialize<O>(buf: Buffer): BentoResponseData<O>;
    deserializeRequest<O, C>(buf: BufferWithCtx<C>): BentoRequestData<O, C>;
}
