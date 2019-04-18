import _ from 'lodash'


/**
 * Persist and rehydrate your `Vuex` store
 * via url search params (window.location.search)
 *
 * @class VuexURLSearchParams
 */
class VuexURLSearchParams {
  /**
   * Uses for bypassing handling in the store subscription
   *
   * @memberof VuexURLSearchParams
   *
   * @static
   */
  static subscribeBypass = Symbol('subscribeBypass')


  /**
   * Creates an instance of `VuexURLSearchParams`
   *
   * @memberof VuexURLSearchParams
   *
   * @param {Object} options
   * @param {Object} options.store
   * @param {Array}  options.subscribeTo
   * @param {Object} options.modifiers
   * @param {String} options.qs
   */
  constructor ({
    store,
    subscribeTo = [],
    modifiers = {},
    qs = '',
  } = {}) {
    this.sp = new URLSearchParams(qs)

    this.store = store
    this.subscribeTo = subscribeTo
    this.modifiers = modifiers

    this.store.subscribe(this.subscribe.bind(this))

    window.onpopstate = this.popState.bind(this)

    this.commitSP(this.sp)
  }


  /**
   * Subscribes to the `Vuex` store mutations
   *
   * @memberof VuexURLSearchParams
   *
   * @param {Object} options
   * @param {String} options.type
   * @param {*}      options.payload
   */
  subscribe ({ type, payload }) {
    if (
      payload[VuexURLSearchParams.subscribeBypass] ||
      ! this.subscribeTo.includes(type)
    ) {
      return
    }

    const modifier = this.modifiers[type]
    const key = _.get(modifier, 'key')
    const pushStateModifier = _.get(modifier, 'pushStateModifier')

    if (
      typeof key !== 'string' ||
      !!! key ||
      typeof pushStateModifier !== 'function'
    ) {
      return
    }

    this.pushState(key, pushStateModifier(payload))
  }


  /**
   * Pushes given `key` with `given` value to the `window.history`
   *
   * @memberof VuexURLSearchParams
   *
   * @param {String} key
   * @param {String} value
   */
  pushState (key, value) {
    this.sp.delete(key)

    if (! _.isEmpty(value)) {
      const normalizedValues = Array.isArray(value) ? value : [value]

      for (const normalized of normalizedValues) {
        this.sp.append(key, normalized)
      }
    }

    const qs = this.sp.toString()

    window.history.pushState(qs, null, `?${qs}`)
  }


  /**
   * Handles `window.history` state popping
   *
   * @memberof VuexURLSearchParams
   *
   * @param {Event} event
   */
  popState (event) {
    if (_.isEmpty(event.state)) {
      for (const mutation of this.subscribeTo) {
        const modifier = this.modifiers[mutation]
        const emptyStateModifier = _.get(modifier, 'emptyStateModifier')

        if (modifier && typeof emptyStateModifier === 'function') {
          this.store.commit(mutation, emptyStateModifier())
        }
      }

      return
    }

    this.commitSP(new URLSearchParams(event.state))
  }


  /**
   * Commit popped state value to the `Vuex` store
   *
   * @memberof VuexURLSearchParams
   *
   * @param {URLSearchParams} sp
   */
  commitSP (sp) {
    for (const key of sp.keys()) {

      const mutation = _.findKey(this.modifiers, { key })
      const modifier = this.modifiers[mutation]
      const popStateModifier = _.get(modifier, 'popStateModifier')

      if (mutation && typeof popStateModifier === 'function') {
        const value = sp.getAll(key)
        const modifiedValue = popStateModifier(value)

        modifiedValue[VuexURLSearchParams.subscribeBypass] = true

        this.store.commit(mutation, modifiedValue)
      }
    }
  }
}


export default VuexURLSearchParams
