import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window === 'undefined' ? undefined : sessionStorage,
})

export const userState = atom<User | null>({
  key: 'user-state',
  default: null,
  effects_UNSTABLE: [persistAtom],
})
