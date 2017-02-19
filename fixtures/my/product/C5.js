(function (factory) {
  My = { product: {} };
  My.product.C5 = factory()
}(function () {
  return { a: 1 }
}))
