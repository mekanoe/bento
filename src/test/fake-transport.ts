import Transport from '../transport'
import Bento from '..'

const evt: {
  _snd?: InMemoryTransport,
  _rcv?: InMemoryTransport,
  send: (data: Buffer) => Promise<Buffer>
} = {
  send: (data: Buffer) => {
    if (evt._rcv === undefined) {
      throw new Error('oops')
    }

    return evt._rcv.reciever({ buffer: data, ctx: { env: 'testing' } })
  }
}

export class InMemoryTransport extends Transport {
  sender (data: Buffer): Promise<Buffer> {
    return evt.send(data)
  }
}

export const createClient = (b: Bento) => {
  evt._snd = new InMemoryTransport(b)
  return evt._snd
}

export const createServer = (b: Bento) => {
  evt._rcv = new InMemoryTransport(b)
  return evt._rcv
}
