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
  buffer: ArrayBuffer,
  ctx: C
}

export interface IBentoTransport {
  serializer: IBentoSerializer

  /**
   * sender will be called by Bento when data is
   * ready to be sent out.
   */
  sender (data: ArrayBuffer, _: { service: string, fn: string }): Promise<ArrayBuffer>

  /**
   * reciever should be called by the implementer when
   * an RPC call is incoming.
   */
  receiver<C> (data: BufferWithCtx<C>): Promise<ArrayBuffer>
}

export interface IBentoSerializer {
  // client serializes a request into Buffer -- OR --
  // server serializes a response into Buffer
  serialize<I> (input: BentoRequestData<I, null> | BentoResponseData<I>): ArrayBuffer

  // client deserializes a response from Buffer, but with NO context (null)
  deserialize<O> (buf: ArrayBuffer): BentoResponseData<O>

  // server deserializes a request from Buffer, but with a context
  deserializeRequest<O, C> (buf: BufferWithCtx<C>): BentoRequestData<O, C>
}
