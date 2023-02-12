import { readdir, stat, copyFile, readJSON, writeJSON } from 'fs-extra'
import { join, dirname } from 'node:path'
import { cwd } from 'node:process'
import { kebabCase } from 'lodash'

const dirPath = join(cwd(), 'assets')
const targetDirPath = join(cwd(), 'emoji')

const colorMap = ['Dark', 'Default', 'Light', 'Medium', 'Medium-Dark', 'Medium-Light']

const metadata = {
  categories: {
    'Smileys & Emotion': [],
    'People & Body': [],
    'Animals & Nature': [],
    'Food & Drink': [],
    'Symbols': [],
    'Travel & Places': [],
    'Objects': [],
    'Activities': [],
    'Flags': [],
  }
}
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
            const name = kebabCase(dirname(path).split(dirPath)[1])
            await copyFile(join(path, fileName), join(targetDirPath, name, 'default', 'emoji.svg'))
          } else {
            const name = kebabCase(dirname(path).split(dirPath)[1].split('/')[1])
            const color = dirname(path).split('/').at(-1)
            await copyFile(join(path, fileName), join(targetDirPath, name, color.toLowerCase(), 'emoji.svg'))
          }
        }
      }
      if (fileName.includes('.json')) {
        const name = kebabCase(path.split(dirPath)[1])
        await copyFile(join(path, fileName), join(targetDirPath, name, fileName))
        const json = await readJSON(join(path, fileName))
        if (Array.isArray(metadata.categories[json.group])) {
          metadata.categories[json.group].push(name)
        }
      }
    }
  }
}

async function main() {
  await resolveDir(dirPath)
  await writeJSON(join(targetDirPath, 'metadata.json'), metadata, { spaces: 2 })
}

main()
