import { IBentoSerializer, BentoRequestData, BentoResponseData, BufferWithCtx } from '../types'

export default class JSONSerializer implements IBentoSerializer {
  constructor (
    private opts: { verbose: boolean } = { verbose: false }
  ) {}

  serialize<I> (input: BentoRequestData<I, null> | BentoResponseData<I>): Buffer {
    if (this.opts.verbose === true) {
      console.group('serialize')
      console.log('input', input)
      console.groupEnd()
    }

    return Buffer.from(JSON.stringify(input))
  }

  deserialize<O> (buf: Buffer): BentoResponseData<O> {
    if (this.opts.verbose === true) {
      console.group('deserialize')
      console.log('buf', buf.toString())
      console.groupEnd()
    }

    return JSON.parse(buf.toString())
  }

  deserializeRequest<O, C> (buf: BufferWithCtx<C>): BentoRequestData<O, C> {
    if (this.opts.verbose === true) {
      console.group('deserializeRequest')
      console.log('buf', { ...buf, buffer: buf.buffer.toString() })
      console.groupEnd()
    }

    return {
      ...JSON.parse(buf.buffer.toString()),
      ctx: buf.ctx
    }
  }
}
