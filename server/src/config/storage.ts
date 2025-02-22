import { StorageClient } from '@supabase/storage-js'
import ENV from '../environment'

export const storageClient = new StorageClient(ENV.STORAGE_URL, {
  apikey: ENV.STORAGE_ACCESS_ID,
  Authorization: `Bearer ${ENV.STORAGE_ACCESS_KEY}`,
})