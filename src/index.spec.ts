import fs from 'fs';
import { createTestHarness } from '.';

fs.readdirSync('fixtures/my/product').forEach(caseName => {
  test(`import global namespace by relative path: ${caseName}`, async () => {
    // see './fixtures/my/product' folder for syntax supported.
    const harness = await createTestHarness({
      rootDir: '.',
      namespaces: {
        'My': './fixtures/my'
      }
    })
    const filename = caseName.slice(0, caseName.length - 3)
    let actual = await harness.import(`./fixtures/my/product/${filename}.js`)
    expect(actual).toEqual({ a: 1 })
  })
})

test('import top level file using relative path', async () => {
  const harness = await createTestHarness({
    rootDir: './fixtures/top'
  })
  let actual = await harness.import('./foo')
  expect(actual).toEqual({ a: 1 })
})

test('import file by relative path', async () => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })
  let actual = await harness.import('./product/Component.js')
  expect(actual).toEqual({ a: 1 })
})

test('import file by namespace path', async () => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })

  let actual = await harness.import('My.product.Component')
  expect(actual).toEqual({ a: 1 })
})

test('import modules', async () => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })

  // `aurelia-logging-color` depends on `color-map`
  // The harness will load that automatically
  const Color = await harness.import('aurelia-logging-color')
  expect(Color.ColorAppender).not.toBeUndefined()

  // Can also import CommonJS modules
  const lowercase = await harness.import('lower-case')

  expect(lowercase('Mister')).toBe('mister')
})

test('getWindow()', async () => {
  const harness = await createTestHarness({
    rootDir: '.',
    namespaces: {
      'My': './fixtures/my'
    }
  })
  const window = harness.window
  expect(window.document).not.toBeUndefined()
})

test('can preload `color-map` and `aurelia-logging-color` scripts', async () => {
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
  expect(harness.window.ColorMap).not.toBeUndefined()
  expect(harness.window.AureliaLoggingColor).not.toBeUndefined()
})

test('get(path)', async () => {
  const harness = await createTestHarness({
    rootDir: './fixtures/my',
    namespaces: {
      'My': '.'
    }
  })
  let grid = await harness.import('My.product.Component')

  expect(harness.get('My.product.Component')).toEqual(grid)
})

test('access global namespace', async () => {
  const harness = await createTestHarness(
    {
      preloadScripts: [
        './node_modules/global-store/dist/global-store.es5.js'
      ]
    })

  expect(harness.window.GlobalStore).toBeTruthy()
})

test('color logs', async () => {
  const harness = await createTestHarness()
  const Logging = await harness.import('aurelia-logging')
  const Color = await harness.import('aurelia-logging-color')

  Logging.addAppender(new Color.ColorAppender())
  Logging.setLevel(Logging.logLevel.debug)
  const log = Logging.getLogger('color log')
  log.debug('do some color')
  console.info('check console output')
})

test('code is inside "src"', async () => {
  const harness = await createTestHarness({
    rootDir: './fixtures/fool',
    namespaces: {
      'Fool': './src/fool'
    }
  })

  const Fool = await harness.import('Fool')
  expect(Fool.a).toBe(2)

  const boo = await harness.import('Fool.boo')
  expect(boo.a).toBe(1)

  const colorMap = await harness.import('color-map')
  expect(colorMap).toBeTruthy()
})

test('undefined namespace returns undefined', async () => {
  const harness = await createTestHarness()
  expect(harness.get('a.b.c.d.e')).toBeUndefined()
})
