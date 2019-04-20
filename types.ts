export type BentoRequestData<T, C> = {
  service: string,
  fn: string,
  input: T,
  ctx?: C
}

export type BentoResponseData<T> = {
  error?: false,
  response: T
} | {
  error: true,
  errorMsg: string
}

export type BufferWithCtx<C> = {
  buffer: Buffer,
  ctx: C
}

export interface IBentoTransport {
  /**
   * sender will be called by Bento when data is
   * ready to be sent out.
   */
  sender (data: Buffer): Promise<Buffer>

  /**
   * reciever should be called by the implementer when
   * an RPC call is incoming.
   */
  reciever<C> (data: BufferWithCtx<C>): Promise<Buffer>
}

export interface IBentoSerializer {
  // client serializes a request into Buffer -- OR --
  // server serializes a response into Buffer
  serialize<I> (input: BentoRequestData<I, null> | BentoResponseData<I>): Buffer

  // client deserializes a response from Buffer, but with NO context (null)
  deserialize<O> (buf: Buffer): BentoResponseData<O>

  // server deserializes a request from Buffer, but with a context
  deserializeRequest<O, C> (buf: BufferWithCtx<C>): BentoRequestData<O, C>
}
