import { BufferWithCtx, IBentoTransport } from './types'
import Bento from '.'

export default class Transport implements IBentoTransport {
  constructor (
    private bento: Bento
  ) {}

  /**
   * Sender takes in a buffer, and waits for a response.
   */
  sender (data: Buffer): Promise<Buffer> {
    return this.receiver({
      buffer: data,
      ctx: { type: 'inmemory' }
    })
  }

  /**
   * Receiver takes in a buffer with ctx, and replies with a response.
   */
  receiver<C> (data: BufferWithCtx<C>): Promise<Buffer> {
    return this.bento.receiveRequest(data)
  }
}
