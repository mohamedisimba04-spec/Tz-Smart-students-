'use client'

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadFile(path: string, file: File, onProgress?: (pct: number) => void) {
  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(pct)
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}
