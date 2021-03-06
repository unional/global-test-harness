# global-test-harness

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[![Semantic Release][semantic-release-image]][semantic-release-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[![Wallaby.js][wallaby-image]][wallaby-url]

Starts a `jsdom` instance and load global namespace code similar to module code for testing.

## Usage

See [`src/index.spec.ts`](src/index.spec.ts)

Also, the file structure should match the namespace stucture, and each file should declares only one component.
e.g. `mycompany/product/SomeComponent.js` declares `MyCompany.product.SomeComponent`.

If your code deviate from it, you can still use this library but you need to do this to get your component:

```ts
await harness.import('./relative/path/to/your/file')
const yourComponent = harness.get('YourCompany.yourProduct.yourComponent')
```

Note that this library does not resolve global namespace references magically.
You need to load your files in the right order.

## Contribute

```sh
# right after clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# edit `webpack.config.es5.js` and `rollup.config.es2015.js` to exclude dependencies for the bundle if needed

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

## Npm Commands

There are a few useful commands you can use during development.

```sh
# Run tests (and lint) automatically whenever you save a file.
npm run watch

# Run tests with coverage stats (but won't fail you if coverage does not meet criteria)
npm run test

# Manually verify the project.
# This will be ran during 'npm preversion' so you normally don't need to run this yourself.
npm run verify

# Build the project.
# You normally don't need to do this.
npm run build

# Run tslint
# You normally don't need to do this as `npm run watch` and `npm version` will automatically run lint for you.
npm run lint
```

Generated by [`unional-cli@0.0.0`](https://github.com/unional/unional-cli)

[stable-image]: http://badges.github.io/stability-badges/dist/stable.svg
[stable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/global-test-harness.svg?style=flat
[npm-url]: https://npmjs.org/package/global-test-harness
[downloads-image]: https://img.shields.io/npm/dm/global-test-harness.svg?style=flat
[downloads-url]: https://npmjs.org/package/global-test-harness
[travis-image]: https://img.shields.io/travis/unional/global-test-harness/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/global-test-harness?branch=master
[coveralls-image]: https://coveralls.io/repos/github/unional/global-test-harness/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/global-test-harness
[greenkeeper-image]: https://badges.greenkeeper.io/unional/global-test-harness.svg
[greenkeeper-url]: https://greenkeeper.io/
[semantic-release-image]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[wallaby-image]:https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]:https://wallabyjs.com
