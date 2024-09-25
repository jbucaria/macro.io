// fetchMeals.js

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from 'firebase/firestore'
import { db, auth } from '../firebase'

export const fetchMealsByDate = async (selectedDate, lastVisible = null) => {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('No user is logged in.')
  }

  const userId = currentUser.uid
  const mealsCollection = collection(
    db,
    'users',
    userId,
    'meals',
    selectedDate,
    'meals'
  )

  let q = query(mealsCollection, orderBy('createdAt', 'desc'), limit(20))

  if (lastVisible) {
    q = query(
      mealsCollection,
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(20)
    )
  }

  const querySnapshot = await getDocs(q)
  const mealsData = []
  let newLastVisible = null

  querySnapshot.forEach(doc => {
    mealsData.push({ id: doc.id, ...doc.data() })
  })

  if (querySnapshot.docs.length > 0) {
    newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
  }

  return { mealsData, newLastVisible }
}
