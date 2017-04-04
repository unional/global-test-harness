import { create } from 'domture'
import { join } from 'path'

import { TestHarnessConfig, TestHarness, Namespaces } from './interfaces'
import { TestHarnessImpl } from './TestHarnessImpl'

export async function createTestHarness(config: TestHarnessConfig): Promise<TestHarness> {
  const domture = await create({
    packageManager: 'npm',
    map: getPathConfig(config.srcRoot, config.namespaces),
    packages: getPackageConfig(config.namespaces),
    srcRoot: config.srcRoot,
    scripts: config.scripts
  })

  return new TestHarnessImpl(domture, config)
}

function getPathConfig(root, namespaces) {
  const keys = Object.keys(namespaces)
  return keys.reduce((v, key) => {
    v[key] = './' + join(root, namespaces[key].path)
    return v
  }, {})
}

function getPackageConfig(namespaces: Namespaces) {
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
