import test from 'ava'
import fixture from 'ava-fixture'
import Order from 'assert-order'

import { createTestHarness } from './index'

const ftest = fixture(test, 'fixtures/my/product')

ftest.each(async (t, d) => {
  // see './fixtures/my/product' folder for syntax supported.
  const harness = await createTestHarness('My', './fixtures/my')
  const filename = d.caseName.slice(0, d.caseName.length - 3)
  let grid = await harness.import('./fixtures/my/product/' + filename)
  t.deepEqual(grid, { a: 1 })
})

test('import file by namespace path', async t => {
  const harness = await createTestHarness('My', './fixtures/my')
  let grid = await harness.import('my/product/Component')
  t.deepEqual(grid, { a: 1 })

  // The namespace root can also follows namespace capitalization.
  grid = await harness.import('My/product/Component')
  t.deepEqual(grid, { a: 1 })
})

test('import file by relative path', async t => {
  const harness = await createTestHarness('My', './fixtures/my')
  let grid = await harness.import('./fixtures/my/product/Component')
  t.deepEqual(grid, { a: 1 })
})

test('import modules', async t => {
  const harness = await createTestHarness('My', './fixtures/my')

  // `aurelia-logging-color` depends on `color-map`
  // The harness will load that automatically
  const Color = await harness.import('aurelia-logging-color')
  t.not(Color.ColorAppender, undefined)

  // Can also import CommonJS modules
  const lowercase = await harness.import('lower-case')
  t.is(lowercase('Mister'), 'mister')
})

test('getWindow()', async t => {
  const harness = await createTestHarness('My', './fixtures/my')
  const window = await harness.window
  t.not(window.document, undefined)
})

test('can configure jsdom', async t => {
  const order = new Order(1)
  const harness = await createTestHarness('My', './fixtures/my', {
    scripts: [
      // Need to use `require.resolve` to find the abs path.
      // Need to point to the bundled version as this is loaded in script tag.
      // Need to manually load all dependencies as in script tag.
      require.resolve('color-map/dist/color-map.es5.js'),
      require.resolve('aurelia-logging-color/dist/aurelia-logging-color.es5.js')
    ],
    // This will be invoked.
    done() {
      order.step(0)
    }
  })
  const window: any = await harness.window
  t.not(window.ColorMap, undefined)
  t.not(window.AureliaLoggingColor, undefined)
  t.is(order.next, 1)
})

test('Throw on invoke', async t => {
  t.throws(createTestHarness('My', './fixtures/my', {
    done() {
      throw new Error("I don't like you.")
    }
  }))
})

test('get(path)', async t => {
  const harness = await createTestHarness('My', './fixtures/my')
  let grid = await harness.import('my/product/Component')

  t.deepEqual(harness.get('My.product.Component'), grid)
  t.deepEqual(harness.get('my/product/Component'), grid)
})
