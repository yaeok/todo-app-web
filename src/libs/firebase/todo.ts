import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from '@/libs/config'

export const registerTodo = async (args: {
  title: string
  description: string
  uid: string
}) => {
  const colRef = collection(db, 'users', args.uid, 'todos')
  await addDoc(colRef, {
    title: args.title,
    description: args.description,
    isCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: null,
    deletedAt: null,
    completedAt: null,
    isActive: true,
  }).then((docRef) => {
    setDoc(docRef, { todoId: docRef.id }, { merge: true })
  })
}

export const updateIsCompleted = async (args: {
  uid: string
  todoId: string
  isCompleted: boolean
}) => {
  const docRef = doc(db, 'users', args.uid, 'todos', args.todoId)
  await setDoc(
    docRef,
    {
      isCompleted: args.isCompleted,
      updatedAt: serverTimestamp(),
      completedAt: args.isCompleted ? serverTimestamp() : null,
    },
    { merge: true }
  )
}
