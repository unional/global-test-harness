import extend = require('deep-extend')
import { create } from 'domture'
import { join } from 'path'

import { TestHarnessConfig, TestHarness, Namespaces } from './interfaces'
import { TestHarnessImpl } from './TestHarnessImpl'

export async function createTestHarness(config: TestHarnessConfig): Promise<TestHarness> {
  const map = getPathConfig(config.srcRoot, config.namespaces)
  const packages = getPackageConfig(config.namespaces)
  const domture = await create(extend({
    packageManager: 'npm',
    systemjsConfig: {
      map,
      packages
    }
  }, config))

  return new TestHarnessImpl(domture, config)
}

function getPathConfig(root: string, namespaces: Namespaces) {
  const keys = Object.keys(namespaces)
  return keys.reduce<{ [index: string]: string }>((v, key) => {
    v[key] = './' + join(root, namespaces[key].path)
    return v
  }, {})
}

function getPackageConfig(namespaces?: Namespaces) {
  if (!namespaces) {
    return undefined
  }

  const keys = Object.keys(namespaces)
  return keys.reduce((v, key) => {
    v[key] = {
      defaultExtension: 'js'
    }
    const ns = namespaces[key];
    if (ns.main) {
      v[key].main = ns.main
    }
    return v
  }, {})
}
