import 'url-search-params-polyfill'

import VuexURLSearchParams from '../lib/VuexURLSearchParams'


/**
 * Returns function for using as `Vuex` store plugin
 *
 * @export
 * @param {Object} options
 * @param {Object} options.store
 * @param {Array}  options.subscribeTo
 * @param {Object} options.modifiers
 * @param {String} options.qs
 *
 * @returns {Function}
 */
export default function getVuexURLSearchParams (options) {
  const defaultOptions = {
    subscribeTo: [],
    modifiers: {},
    qs: (window => (
      window &&
      window.location &&
      window.location.search &&
      window.location.search.replace(/^\?/, '') ||
      ''
    ))(window),
  }

  return store => new VuexURLSearchParams({
    store,
    ...defaultOptions,
    ...options,
  })
}
