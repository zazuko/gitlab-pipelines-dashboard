/* eslint-disable no-console */
import store from './store'
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      store.dispatch('sw/ready')
    },
    registered () {
      store.dispatch('sw/registered')
    },
    cached () {
      store.dispatch('sw/cached')
    },
    updatefound () {
      store.dispatch('sw/updatefound')
    },
    updated (registration) {
      store.dispatch('sw/updated', registration)
    },
    offline () {
      store.dispatch('sw/offline')
    },
    error (error) {
      store.dispatch('sw/error', error)
    }
  })
}
