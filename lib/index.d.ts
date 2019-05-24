/// <reference types="node" />
import { IBentoTransport, IBentoSerializer, BentoRequestData, BentoResponseData, BufferWithCtx } from './types';
export { default as JSONSerializer } from './serializers/json';
export { default as Transport } from './transport';
declare type Constructor<T> = {
    new (b: Bento): T;
};
declare type Transport = Constructor<IBentoTransport>;
declare type Client<T> = {
    new (b: Bento, tt?: IBentoTransport): T;
    __SERVICE__: string;
};
declare type Service<T> = Constructor<T>;
export default class Bento {
    private serializer;
    constructor(serializer: IBentoSerializer);
    transport?: IBentoTransport;
    private serviceRegistry;
    service<T>(name: string | (() => string), impl: Service<T>): void;
    addTransport(tt: Transport): IBentoTransport;
    client<T>(impl: Client<T>, tt?: IBentoTransport): T;
    makeRequest<I, O>(transport: IBentoTransport | undefined, service: string, fn: string, input: I): Promise<O>;
    recieveRequest<I, O, C>(buf: BufferWithCtx<C>): Promise<Buffer>;
    call<I, O, C>(req: BentoRequestData<I, C>): Promise<O>;
}
export { IBentoTransport, IBentoSerializer, BentoRequestData, BentoResponseData };
