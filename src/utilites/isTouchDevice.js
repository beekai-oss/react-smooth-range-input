// @flow

export default () =>
  'ontouchstart' in window || window.navigator.MaxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
