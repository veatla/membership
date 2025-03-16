// this file is JS because worker threads doesn't friendly with .ts files
// And it's being used there 

import { StorageClient } from '@supabase/storage-js'
import ENV from '../environment'

export const storageClient = new StorageClient(ENV.SUPABASE_STORAGE_URL, {
  apikey: ENV.STORAGE_ACCESS_ID,
  Authorization: `Bearer ${ENV.STORAGE_SECRET_KEY}`,
})
