import { persisted } from 'svelte-local-storage-store'

export const countStore = persisted('local:countStore', 0)
