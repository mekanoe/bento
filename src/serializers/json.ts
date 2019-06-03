import { IBentoSerializer, BentoRequestData, BentoResponseData, BufferWithCtx } from '../types'

const enc = new TextEncoder()
const dec = new TextDecoder()

export default class JSONSerializer implements IBentoSerializer {
  constructor (
    private opts: { verbose: boolean } = { verbose: false }
  ) {}

  serialize<I> (input: BentoRequestData<I, null> | BentoResponseData<I>): Uint8Array {
    if (this.opts.verbose === true) {
      console.group('serialize')
      console.log('input', input)
      console.groupEnd()
    }

    return enc.encode(JSON.stringify(input))
  }

  deserialize<O> (buf: ArrayBuffer): BentoResponseData<O> {
    if (this.opts.verbose === true) {
      console.group('deserialize')
      console.log('buf', dec.decode(buf))
      console.groupEnd()
    }

    return JSON.parse(dec.decode(buf))
  }

  deserializeRequest<O, C> (buf: BufferWithCtx<C>): BentoRequestData<O, C> {
    if (this.opts.verbose === true) {
      console.group('deserializeRequest')
      console.log('buf', { ...buf, buffer: dec.decode(buf.buffer) })
      console.groupEnd()
    }

    return {
      ...JSON.parse(dec.decode(buf.buffer)),
      ctx: buf.ctx
    }
  }
}
