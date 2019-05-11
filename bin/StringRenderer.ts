export default class StringRenderer {
  _data: string = ''

  r = (str: string) => {
    this._data += `${str}\n`
  }

  data = () => {
    return this._data
  }
}
