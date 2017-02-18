# global-test-harness

[![stable][stable-image]][stable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
![badge-size-es5-url]
![badge-size-es2015-url]

Starts a `jsdom` instance and load global namespace code similar to module code for testing.

## Usage

See [`src/index.spec.ts`](src/index.spec.ts)

This library assume you put all your global namespace code under a single root.
e.g. `MyCompany.xxx.xxx.xxx`.

Also, the file structure should match the namespace stucture, and each file should declares only one component.
e.g. `mycompany/product/SomeComponent.js` declares `MyCompany.product.SomeComponent`.

If your code deviate from it, you can still use this library but you need to do this to get your component:

```ts
await harness.import('...your file')
const yourComponent = harness.get('namespace path to your component')
```

Note that this library does not resolve your global namespace reference magically.
You need to load your files in the right order to run the test.

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
[travis-image]: https://img.shields.io/travis/unional/global-test-harness.svg?style=flat
[travis-url]: https://travis-ci.org/unional/global-test-harness
[coveralls-image]: https://coveralls.io/repos/github/unional/global-test-harness/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/global-test-harness
[badge-size-es5-url]: http://img.badgesize.io/unional/global-test-harness/master/dist/global-test-harness.es5.js.svg?label=es5_size
[badge-size-es2015-url]: http://img.badgesize.io/unional/global-test-harness/master/dist/global-test-harness.es2015.js.svg?label=es2015_size
