# Vuex URL Search Params

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/vuex-url-search-params/badge.svg)](https://coveralls.io/github/LordotU/vuex-url-search-params)

## Description

Persist and rehydrate your Vuex store via url search params (*window.location.search*).

## Installation

```bash
npm i --save vuex-url-search-params
# or
yarn add vuex-url-search-params
```

## Testing

```bash
npm i --no-save vue@2.x vue-template-compiler@2.x vuex@3.x # Optionally
yarn test:jest # Runs Jest with coverage collection
yarn test:coverage # Sends coverage to .coveralls.io
yarn test # yarn test:jest && yarn test:coverage
```

## Usage

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

import getVuexUrlSearchParams from 'vuex-url-search-params'


Vue.use(Vuex)

const vuexUrlSearchParamsOptions = {
  subscribeTo: ['setFilter'],
  modifiers: {
    setFilter: {
      key: 'filter',
      pushStateModifier: payload => payload,
      popStateModifier: value => value,
      emptyStateModifier: () => [],
    }
  },
}

const store = new Vuex.Store({
  plugins: [getVuexUrlSearchParams(vuexUrlSearchParamsOptions)],

  state: {
    filter: [],
  },

  mutations: {
    setFilter (state, payload) {
      state.filter = payload
    },
  },
})

new Vue({
  store,
  el: '#app',
})
```

## Configuring
***Note***, this plugin is now suitable only for array-like and iterable Vuex state values!

### Options

#### `subscribeTo = [] <Array>`
Mutations types for subscribing.

#### `modifiers = {} <Object>`
Object which defines how to `<mutationType>` payload will be transform to the query string search param and back

#### `modifiers.<mutationType>.key <String>`
Query string search param name

#### `modifiers.<mutationType>.pushStateModifier <Function>`
Function for modifying mutation payload value for using it in a query string search param with key above. *Accepts `<mutationType>` payload as the first argument and Vuex store object as the second*

#### `modifiers.<mutationType>.popStateModifier <Function>`
Function for modifying query string search param value for using it in an appropriate mutation. *Accepts query string search param value as the first argument and Vuex store object as the second*

#### `modifiers.<mutationType>.emptyStateModifier <Function>`
Function which result will be used as payload value for mutation when an appropriate query string search param become empty. *Accepts Vuex store object as argument*

#### `qs = window.location.search <String>`
Query string for initialization

#### `store <Vuex.Store>`
Vuex store object
