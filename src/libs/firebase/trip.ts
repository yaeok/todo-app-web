import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { db } from '@/libs/config'

export const registerTrip = async (args: {
  title: string
  description: string
  uid: string
}) => {
  const colRef = collection(db, 'users', args.uid, 'trips')
  await addDoc(colRef, {
    title: args.title,
    description: args.description,
    favorite: false,
    isCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: null,
    deletedAt: null,
    completedAt: null,
    isActive: true,
  }).then((docRef) => {
    setDoc(docRef, { tripId: docRef.id }, { merge: true })
  })
}

export const updateIsCompletedbyTripId = async (args: {
  uid: string
  tripId: string
  isCompleted: boolean
}) => {
  const docRef = doc(db, 'users', args.uid, 'trips', args.tripId)
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

export const updateFavoritebyTripId = async (args: {
  uid: string
  tripId: string
  favorite: boolean
}) => {
  const docRef = doc(db, 'users', args.uid, 'trips', args.tripId)
  await setDoc(
    docRef,
    {
      favorite: args.favorite,
      updatedAt: serverTimestamp(),
      completedAt: args.favorite ? serverTimestamp() : null,
    },
    { merge: true }
  )
}
