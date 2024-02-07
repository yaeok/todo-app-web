import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/libs/config'
import { Todo } from '@/models/todo.model'

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

export const getTodoList = async (args: { uid: string }) => {
  const colRef = collection(db, 'users', args.uid, 'todos')
  const q = query(
    colRef,
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  const lstTodo: Todo[] = []
  snapshot.forEach((doc: any) => {
    const recTodo = {
      todoId: doc.data().todoId,
      title: doc.data().title,
      description: doc.data().description,
      isCompleted: doc.data().isCompleted,
      completedAt: doc.data().completedAt,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      deletedAt: doc.data().deletedAt,
      isActive: doc.data().isActive,
    }
    lstTodo.push(recTodo)
  })
  return lstTodo
}
