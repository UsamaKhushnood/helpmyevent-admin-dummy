export * from './auth.store'
export * from './users.store'
export * from './chat.store'

import { getActivePinia } from 'pinia'

export const resetAllPiniaStores = () => {
  const activeStores = Object.keys(getActivePinia().state.value)
  activeStores.forEach((store) => {
    getActivePinia()._s.get(store).$reset()
  })
}
