import Bento from '.'
// import JSONSerializer from './serializers/json'
// import Transport from './transport'

describe('Bento', () => {
  it('sets up properly', async () => {
    const B = new Bento()
    // const tt = new Transport(B, new JSONSerializer())
    expect(B).not.toBeNull()
  })
})
