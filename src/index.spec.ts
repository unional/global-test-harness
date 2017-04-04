import test from 'ava'
import fixture from 'ava-fixture'

import { createTestHarness } from './index'

const ftest = fixture(test, 'fixtures/my/product')

ftest.each(async (t, d) => {
  // see './fixtures/my/product' folder for syntax supported.
  const harness = await createTestHarness({
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
    }
  })
  const filename = d.caseName.slice(0, d.caseName.length - 3)
  let grid = await harness.import(`./fixtures/my/product/${filename}.js`)
  t.deepEqual(grid, { a: 1 })
})

test('import file by namespace path', async t => {
  const harness = await createTestHarness({
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
    }
  })

  let grid = await harness.import('My.product.Component')
  t.deepEqual(grid, { a: 1 })
})

test('import file by relative path', async t => {
  const harness = await createTestHarness({
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
    }
  })
  let grid = await harness.import('./fixtures/my/product/Component.js')
  t.deepEqual(grid, { a: 1 })
})

test('import modules', async t => {
  const harness = await createTestHarness({
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
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
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
    }
  })
  const window = await harness.window
  t.not(window.document, undefined)
})

test('can preload scripts', async t => {
  const harness = await createTestHarness(
    {
      srcRoot: './fixtures/my',
      namespaces: {
        'My': {
          path: '.'
        }
      },
      scripts: [
        // Need to use `require.resolve` to find the abs path.
        // Need to point to the bundled version as this is loaded in script tag.
        // Need to manually load all dependencies as in script tag.
        require.resolve('color-map/dist/color-map.es5.js'),
        require.resolve('aurelia-logging-color/dist/aurelia-logging-color.es5.js')
      ]
    })
  const window: any = await harness.window
  t.not(window.ColorMap, undefined)
  t.not(window.AureliaLoggingColor, undefined)
})

test('get(path)', async t => {
  const harness = await createTestHarness({
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
    }
  })
  let grid = await harness.import('My.product.Component')

  t.deepEqual(harness.get('My.product.Component'), grid)
})

test('access global namespace', async t => {
  const harness = await createTestHarness(
    {
      srcRoot: './fixtures/my',
      namespaces: {
        'My': {
          path: '.'
        }
      },
      scripts: [
        './node_modules/aurelia-logging-color/dist/aurelia-logging-color.es5.js'
      ]
    })

  const Logging = harness.window.AureliaLoggingColor
  t.truthy(Logging)
})

test('color logs', async _t => {
  const harness = await createTestHarness({
    srcRoot: './fixtures/my',
    namespaces: {
      'My': {
        path: '.'
      }
    }
  })
  const Logging = await harness.import('aurelia-logging')
  const Color = await harness.import('aurelia-logging-color')

  Logging.addAppender(new Color.ColorAppender())
  Logging.setLevel(Logging.logLevel.debug)
  const log = Logging.getLogger('color log')
  log.debug('do some color')
})

test('code is inside "src"', async t => {
  const harness = await createTestHarness({
    srcRoot: './fixtures/fool',
    namespaces: {
      'Fool': {
        main: '../fool.js',
        path: 'src/fool'
      }
    }
  })

  const Fool = await harness.import('Fool')
  t.is(Fool.a, 2)

  const boo = await harness.import('Fool.boo')
  t.is(boo.a, 1)

  const colorMap = await harness.import('color-map')
  t.truthy(colorMap)
})
