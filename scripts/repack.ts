import { readdir, stat, copy } from 'fs-extra'
import { join, dirname } from 'node:path'
import { cwd } from 'node:process'

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
          if (!colorMap.some(color => path.includes(color))) {
            await copy(join(path, fileName), join(targetDirPath, dirname(path).split(dirPath)[1], 'Default', 'emoji.svg'))
          } else {
            await copy(join(path, fileName), join(targetDirPath, dirname(path).split(dirPath)[1], 'emoji.svg'))
          }
        }
      }
      if (fileName.includes('.json')) {
        await copy(join(path, fileName), join(targetDirPath, path.split(dirPath)[1], fileName))
      }
    }
  }
}

resolveDir(dirPath)