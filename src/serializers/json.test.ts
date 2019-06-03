import JSONSerializer from './json'
import { BufferWithCtx, BentoResponseData, BentoRequestData } from '../types'

const enc = new TextEncoder()
const dec = new TextDecoder()

describe('JSONSerializer', () => {
  const js = new JSONSerializer()
  const o = {
    response: { message: 'hi there!' }
  }
  const ctx = {
    randomData: true
  }
  const i: BentoRequestData<{ name: string }, typeof ctx> = {
    service: 'TestWorld',
    fn: 'ButUltraTest!',
    input: { name: 'there' },
    ctx
  }

  it('serializes data into a buffer', () => {
    const t: ArrayBuffer = js.serialize(o)

    expect(JSON.parse(dec.decode(t))).toStrictEqual(o)
  })

  it('deserializes a response from a buffer', () => {
    const fixture = enc.encode(JSON.stringify(o))
    const t: BentoResponseData<typeof o.response> = js.deserialize(fixture)

    expect(t).toStrictEqual(o)
  })

  it('deserializes a request from a bufferwithctx', () => {
    const fixture: BufferWithCtx<typeof ctx> = {
      buffer: enc.encode(JSON.stringify(i)),
      ctx
    }

    const t: typeof i = js.deserializeRequest(fixture)

    expect(t).toStrictEqual(i)
  })
})
