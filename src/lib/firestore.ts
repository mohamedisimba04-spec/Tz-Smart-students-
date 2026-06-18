import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'

export type Note = {
  id?: string
  title: string
  description?: string
  filePath?: string
  createdAt: number
  subject?: string
  authorId?: string
}

export const notesCollection = collection(db, 'notes')

export async function addNote(note: Omit<Note, 'id' | 'createdAt'>) {
  const docRef = await addDoc(notesCollection, { ...note, createdAt: Date.now() })
  return docRef.id
}

export async function getNotesBySubject(subject?: string) {
  let q
  if (subject) q = query(notesCollection, where('subject', '==', subject), orderBy('createdAt', 'desc'))
  else q = query(notesCollection, orderBy('createdAt', 'desc'), limit(100))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Note[]
}

export async function getNote(id: string) {
  const d = await getDoc(doc(db, 'notes', id))
  if (!d.exists()) return null
  return { id: d.id, ...(d.data() as any) } as Note
}

export async function deleteNote(id: string) {
  await deleteDoc(doc(db, 'notes', id))
}

export async function updateNote(id: string, data: Partial<Note>) {
  await updateDoc(doc(db, 'notes', id), data)
}

// Similar patterns can be used for quizzes, pastPapers, discussions, notifications
