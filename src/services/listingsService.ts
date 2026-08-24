import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { RoommateListing } from '../types';

const LISTINGS_COLLECTION = 'listings';

/**
 * Subscribe to realtime listings from Firestore.
 */
export function subscribeToListings(
  callback: (listings: RoommateListing[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(
    collection(db, LISTINGS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: RoommateListing[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          age: data.age || 20,
          gender: data.gender || 'ወንድ (Male)',
          photo: data.photo || '',
          role: data.role || 'ፈልጋለሁ (Looking for Room)',
          country: data.country || 'ኢትዮጵያ (Ethiopia)',
          city: data.city || 'አዲስ አበባ (Addis Ababa)',
          location: data.location || '',
          exactLocation: data.exactLocation || '',
          houseType: data.houseType || 'ኮንዶሚኒየም',
          roomsCount: data.roomsCount || 1,
          budget: data.budget || 0,
          occupation: data.occupation || '',
          lifestyle: Array.isArray(data.lifestyle) ? data.lifestyle : [],
          description: data.description || '',
          phone: data.phone || '',
          telegram: data.telegram || undefined,
          postedDate: data.postedDate || 'በቅርቡ (Recently)',
          isSample: !!data.isSample,
          roomDetails: data.roomDetails || undefined,
        });
      });
      callback(items);
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a listing in Firestore.
 */
export async function saveListingToFirestore(listing: RoommateListing): Promise<void> {
  const docRef = doc(db, LISTINGS_COLLECTION, listing.id);
  const dataToSave = {
    ...listing,
    createdAt: Date.now(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, dataToSave, { merge: true });
}

/**
 * Delete a listing from Firestore.
 */
export async function deleteListingFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, LISTINGS_COLLECTION, id);
  await deleteDoc(docRef);
}
