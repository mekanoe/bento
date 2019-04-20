import pbjs from 'protobufjs'
// import path from 'path'
// import fs from 'fs-extra'
import glob from 'glob'

// const render = (): string => {

// }

const processFile = async (fileName: string) => {
  const f = await pbjs.load(fileName)
  console.log(f)
}

export const run = async (globPath: string) => {
  const files = glob.sync(globPath)
  for (const file of files) {
    await processFile(file)
  }
}

run(process.argv[1]).catch((e) => {
  console.error(e)
})
