import type { Plugin } from 'vite'
import { init, parse } from 'es-module-lexer'
import * as path from 'pathe'
import { log } from 'node:console'

export function getModuleId (file: string) {
  const base = path.basename(file, path.extname(file)) // todo.server
  const id = base.split('.')[0] // todo
  return id
}

interface Options {
  filter: (id: unknown) => boolean
}

export function transformServerFiles (options: Options): Plugin {
  return {
    name: 'vite-plugin-remote-functions',
    enforce: 'post',
    async transform (code, id, opts) {
      if (opts?.ssr) {
        return
      }

      if (!options.filter(id)) {
        return
      }

      const moduleId = getModuleId(id)
      const result = await transformExportsToRemoteFunctions(code, moduleId)

      return {
        code: result
      }
    }
  }
}

async function transformExportsToRemoteFunctions (src: string, moduleId: string) {
  await init

  const [imports, exports] = parse(src)

  const exportList = exports.map((e) => {
    console.log('e', e)
    if (e.n === 'default') {

      return `export default (...args) => client.${moduleId}.${e.n}(...args)`
    }

    return `export const ${e.n} = (...args) => client.${moduleId}.${e.n}(...args)`
  })

  return `
    import { createClient } from '#imports'
    const client = createClient()

    ${exportList.join('\n')}
  `
}

function isFirstLetterUpperCase(str: string) {
  // Get the first character of the string
  const firstChar = str.charAt(0);
  // Convert the first character to uppercase
  const firstCharUpperCase = firstChar.toUpperCase();
  // Compare the first character with the uppercase version
  // If they are the same, it means the first letter is uppercase
  return firstChar === firstCharUpperCase;
}
