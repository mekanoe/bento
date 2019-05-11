import Bento, { IBentoTransport } from '..'

export type HelloRequest = {
  name?: string
}

export type HelloReply = {
  message?: string
}

export interface IHelloWorldService {
  sayHello (ctx: any, request: HelloRequest): Promise<HelloReply>
}

export class HelloWorldClient {
  static __SERVICE__: string = 'HelloWorld'
  constructor (
    private bento: Bento,
    private transport?: IBentoTransport
  ) {}

  async sayHello (request: HelloRequest): Promise<HelloReply> {
    // tell bento to make the request
    return this.bento.makeRequest(this.transport || undefined, 'HelloWorld', 'sayHello', request)
  }
}

export default () => {
  return `HelloWorld`
}
