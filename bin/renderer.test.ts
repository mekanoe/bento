import { run } from './renderer'
describe('Renderer', () => {
  it('runs', async () => {
    await run('./**/*.proto')
  })
})
