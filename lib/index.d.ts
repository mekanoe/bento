/// <reference types="node" />
import { IBentoTransport, IBentoSerializer, BentoRequestData, BentoResponseData, BufferWithCtx } from './types'
export { default as JSONSerializer } from './serializers/json'
export { default as Transport } from './transport'
declare type Constructor<T> = {
  new (b: Bento): T;
}
declare type Client<T> = {
  new (b: Bento, tt?: IBentoTransport): T;
  __SERVICE__: string;
}
declare type Service<T> = Constructor<T>
export default class Bento {
  transport?: IBentoTransport
  serviceRegistry: Map<string, any>
    /**
     * makes this bento instance able to respond to a service definition's rpcs.
     * @param name service name
     * @param impl service implmentation
     */
  service<T> (name: string | (() => string), impl: Service<T>): void
    /**
     * creates a client
     * @param impl client class implementation
     * @param tt optional transport for sending data
     */
  client<T> (impl: Client<T>, tt?: IBentoTransport): T
    /**
     * make a request over supplied or default transport
     * @param transport optional transport
     * @param service service name
     * @param fn rpc function name
     * @param input input data
     */
  makeRequest<I, O> (transport: IBentoTransport | undefined, service: string, fn: string, input: I): Promise<O>
    /**
     * recieve a request from a client
     * @param buf buffer with contextual data attached (e.g. an http handler like koa)
     */
  receiveRequest<I, O, C> (buf: BufferWithCtx<C>, serializer: IBentoSerializer): Promise<Buffer>
  call<I, O, C> (req: BentoRequestData<I, C>): Promise<O>
}
export { IBentoTransport, IBentoSerializer, BentoRequestData, BentoResponseData, BufferWithCtx }
