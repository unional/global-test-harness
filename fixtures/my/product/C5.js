(function (factory) {
  window.My = { product: {} };
  window.My.product.C5 = factory()
}(function () {
  return { a: 1 }
}))
