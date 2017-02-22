(function (factory) {
  My = { product: {} };
  My.product.C4 = factory()
}(function () {
  return { a: 1 }
}))
