import test from 'ava'
import fixture from 'ava-fixture'

import { createTestHarness } from './index'

const ftest = fixture(test, 'fixtures/my/product')

ftest.each(async (t, d) => {
  // see './fixtures/my/product' folder for syntax supported.
  const harness = await createTestHarness({
    rootDir: '.',
    namespaces: {
      'My': './fixtures/my'
    }
  })
  const filename = d.caseName.slice(0, d.caseName.length - 3)
  let actual = await harness.import(`./fixtures/my/product/${filename}.js`)
  t.deepEqual(actual, { a: 1 })
})

test('import top level file using relative path', async t => {
  const harness = await createTestHarness({
    rootDir: './fixtures/top'
  })
  let actual = await harness.import('./foo')
  t.deepEqual(actual, { a: 1 })
})

test('import file by relative path', async t => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })
  let actual = await harness.import('./product/Component.js')
  t.deepEqual(actual, { a: 1 })
})

test('import file by namespace path', async t => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })

  let actual = await harness.import('My.product.Component')
  t.deepEqual(actual, { a: 1 })
})

test('import modules', async t => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })

  // `aurelia-logging-color` depends on `color-map`
  // The harness will load that automatically
  const Color = await harness.import('aurelia-logging-color')
  t.not(Color.ColorAppender, undefined)

  // Can also import CommonJS modules
  const lowercase = await harness.import('lower-case')
  t.is(lowercase('Mister'), 'mister')
})

test('getWindow()', async t => {
  const harness = await createTestHarness({
    rootDir: '.',
    namespaces: {
      'My': './fixtures/my'
    }
  })
  const window = harness.window
  t.not(window.document, undefined)
})

test('can preload `color-map` and `aurelia-logging-color` scripts', async t => {
  // Failing due to `systemjs`. Need to debug in.
  const harness = await createTestHarness(
    {
      preloadScripts: [
        // Need to use `require.resolve` to find the abs path.
        // Need to point to the bundled version as this is loaded in script tag.
        // Need to manually load all dependencies as in script tag.
        require.resolve('color-map/dist/color-map.es5.js'),
        require.resolve('aurelia-logging-color/dist/aurelia-logging-color.js')
      ]
    })
  t.not(harness.window.ColorMap, undefined)
  t.not(harness.window.AureliaLoggingColor, undefined)
})

test('get(path)', async t => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })
  let grid = await harness.import('My.product.Component')

  t.deepEqual(harness.get('My.product.Component'), grid)
})

test('access global namespace', async t => {
  const harness = await createTestHarness(
    {
      preloadScripts: [
        './node_modules/global-store/dist/global-store.es5.js'
      ]
    })

  t.truthy(harness.window.GlobalStore)
})

test('color logs', async t => {
  const harness = await createTestHarness()
  const Logging = await harness.import('aurelia-logging')
  const Color = await harness.import('aurelia-logging-color')

  Logging.addAppender(new Color.ColorAppender())
  Logging.setLevel(Logging.logLevel.debug)
  const log = Logging.getLogger('color log')
  log.debug('do some color')
  t.pass('check console output')
})

test('code is inside "src"', async t => {
  const harness = await createTestHarness({
    rootDir: './fixtures/fool',
    namespaces: {
      'Fool': './src/fool'
    }
  })

  const Fool = await harness.import('Fool')
  t.is(Fool.a, 2)

  const boo = await harness.import('Fool.boo')
  t.is(boo.a, 1)

  const colorMap = await harness.import('color-map')
  t.truthy(colorMap)
})

test('undefined namespace returns undefined', async t => {
  const harness = await createTestHarness()
  t.is(harness.get('a.b.c.d.e'), undefined)
})
