/// <reference types="node" />
export declare type BentoRequestData<T, C> = {
  service: string;
  fn: string;
  input: T;
  ctx?: C;
}
export declare type BentoResponseData<T> = {
  error?: false;
  response: T;
} | {
  error: true;
  errorMsg: string;
}
export declare type BufferWithCtx<C> = {
  buffer: Buffer;
  ctx: C;
}
export interface IBentoTransport {
  serializer: IBentoSerializer
    /**
     * sender will be called by Bento when data is
     * ready to be sent out.
     */
  sender (data: Buffer, _: {
      service: string;
      fn: string;
    }): Promise<Buffer>
    /**
     * reciever should be called by the implementer when
     * an RPC call is incoming.
     */
  receiver<C> (data: BufferWithCtx<C>): Promise<Buffer>
}
export interface IBentoSerializer {
  serialize<I> (input: BentoRequestData<I, null> | BentoResponseData<I>): Buffer
  deserialize<O> (buf: Buffer): BentoResponseData<O>
  deserializeRequest<O, C> (buf: BufferWithCtx<C>): BentoRequestData<O, C>
}
