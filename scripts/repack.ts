import { readdir, stat, copy } from 'fs-extra'
import { join, dirname } from 'node:path'
import { cwd } from 'node:process'
import { kebabCase } from 'lodash'

const dirPath = join(cwd(), 'assets')
const targetDirPath = join(cwd(), 'emoji')

const colorMap = ['Dark', 'Default', 'Light', 'Medium', 'Medium-Dark', 'Medium-Light']

async function resolveDir(path: string) {
  for (const fileName of await readdir(path)) {
    const path2 = join(path, fileName)
    if (await (await stat(path2)).isDirectory()) {
      resolveDir(path2)
    }
    else {
      if (fileName.includes('.svg')) {
        if (path.includes('Flat')) {
          const name = kebabCase(dirname(path).split(dirPath)[1])
          if (!colorMap.some(color => path.includes(color))) {
            await copy(join(path, fileName), join(targetDirPath, name, 'default', 'emoji.svg'))
          } else {
            await copy(join(path, fileName), join(targetDirPath, name, 'emoji.svg'))
          }
        }
      }
      if (fileName.includes('.json')) {
        const name = kebabCase(path.split(dirPath)[1])
        await copy(join(path, fileName), join(targetDirPath, name, fileName))
      }
    }
  }
}

async function main() {
  await resolveDir(dirPath)
  // 单独复制 metadata.json
  await copy(join(cwd(), 'metadata.json'), join(targetDirPath, 'metadata.json'))
}

main()
