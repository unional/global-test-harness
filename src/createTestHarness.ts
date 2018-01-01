import { createDomture, Domture } from 'domture'
import { unpartial } from 'unpartial'

import { defaultConfig } from './constants'
import {
  generateNamespaceToRelativeFunction,
  generateRelativeToNamespaceFunction
} from './generates'
import { TestHarnessConfig, TestHarness } from './interfaces'
import { isRelative } from './isRelative'
import { log } from './log'

export async function createTestHarness(givenConfig: Partial<TestHarnessConfig> = {}): Promise<TestHarness> {
  const config = unpartial(defaultConfig, givenConfig)
  const domture = await createDomture(config)

  mixin(domture, config)
  return domture as TestHarness
}

function mixin(domture: Domture, config: TestHarnessConfig) {
  const harness = domture as TestHarness

  const toRelative = generateNamespaceToRelativeFunction(config.rootDir, config.namespaces)
  const toNamespace = generateRelativeToNamespaceFunction(config.rootDir, config.namespaces)

  const origImport = domture.import
  harness.import = async function (this: TestHarness, identifier: string) {
    log.debug('import', identifier)
    if (isRelative(identifier)) {
      const namespacePath = toNamespace(identifier)
      const result = await origImport.call(domture, identifier)
      return isEmptyObject(result) ? this.get(namespacePath) : result
    }
    else {
      let relative = toRelative(identifier)
      if (relative) {
        const result = await origImport.call(domture, relative)
        if (isEmptyObject(result))
          return this.get(identifier)
        else
          return result
      }
      else {
        return origImport.call(domture, identifier)
      }
    }
  }
}

function isEmptyObject(subject) {
  return typeof subject === 'object' && Object.keys(subject).length === 0
}
