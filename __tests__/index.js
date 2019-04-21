import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

import getVuexURLSearchParams from '../src'
import VuexURLSearchParams from '../lib/VuexURLSearchParams'


const localVue = createLocalVue()
localVue.use(Vuex)

window.history.back = (plugin, state) => plugin.popState({ state })

describe('getVuexURLSearchParams helper', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store()
  })

  test('should returns instance of VuexURLSearchParams', () => {
    expect(getVuexURLSearchParams()(store)).toBeInstanceOf(VuexURLSearchParams)
  })

  test('should returns instance of VuexURLSearchParams with valid fields', () => {
    const subscribeTo = ['mutation1', 'mutation2']
    const modifiers = {
      mutation1: {},
      mutation2: {},
    }
    const qs = 'key1=value1&key2=value2'

    const vuexURLSearchParams = getVuexURLSearchParams({
      subscribeTo,
      modifiers,
      qs,
    })(store)

    expect(vuexURLSearchParams.sp).toBeInstanceOf(URLSearchParams)
    expect(vuexURLSearchParams.sp.toString()).toBe(qs)
    expect(vuexURLSearchParams.store).toBeInstanceOf(Vuex.Store)
    expect(vuexURLSearchParams.subscribeTo).toEqual(subscribeTo)
    expect(vuexURLSearchParams.modifiers).toEqual(modifiers)
  })
})

describe('VuexURLSearchParams class', () => {
  let store
  let plugin

  beforeEach(() => {
    const pushStateModifier = payload => payload.map(({ id }) => id)
    const popStateModifier = value => value.map(v => ({ id: Number(v) }))
    const emptyStateModifier = () => []

    const pluginOptionsCommon = {
      pushStateModifier,
      popStateModifier,
      emptyStateModifier,
    }

    const pluginOptions = {
      subscribeTo: ['setFilter1', 'setFilter2', 'setFilter3'],
      modifiers: {
        setFilter1: {
          key: 'filter1',
          ...pluginOptionsCommon,
        },
        setFilter2: {
          key: 'filter2',
          ...pluginOptionsCommon,
        }
      }
    }

    store = new Vuex.Store({
      state: {
        filter1: [],
        filter2: [],
      },

      mutations: {
        setFilter1 (state, payload) {
          state.filter1 = payload
        },
        setFilter2 (state, payload) {
          state.filter2 = payload
        },
        setFilter3 () {
          return
        },
        setFilter4 () {
          return
        }
      }
    })

    plugin = getVuexURLSearchParams(pluginOptions)(store)
  })

  test('should ignore mutation with empty payload', () => {
    store.commit('setFilter1')
    expect(window.history.length).toBe(1)
  })

  test('should ignore mutation without modifiers', () => {
    store.commit('setFilter3', 1)
    expect(window.history.length).toBe(1)
  })

  test('should ignore unknown mutation', () => {
    store.commit('setFilter4')
    expect(window.history.length).toBe(1)
  })

  test('should navigate through `window.history`', () => {
    store.commit('setFilter1', [{ id: 1}])
    expect(plugin.sp.toString()).toBe('filter1=1')
    expect(window.location.search).toBe('?filter1=1')

    store.commit('setFilter2', [{ id: 1}])
    expect(plugin.sp.toString()).toBe('filter1=1&filter2=1')
    expect(window.location.search).toBe('?filter1=1&filter2=1')

    store.commit('setFilter2', [{ id: 1}, { id: 2}])
    expect(plugin.sp.toString()).toBe('filter1=1&filter2=1&filter2=2')
    expect(window.location.search).toBe('?filter1=1&filter2=1&filter2=2')

    window.history.back(plugin, 'filter1=1&filter2=1')
    expect(JSON.stringify(store.state)).toBe(JSON.stringify({
      filter1: [{ id: 1 }],
      filter2: [{ id: 1 }],
    }))

    window.history.back(plugin, 'filter1=1')
    expect(JSON.stringify(store.state)).toBe(JSON.stringify({
      filter1: [{ id: 1 }],
      filter2: [],
    }))

    window.history.back(plugin, '')
    expect(JSON.stringify(store.state)).toBe(JSON.stringify({
      filter1: [],
      filter2: [],
    }))
  })
})
