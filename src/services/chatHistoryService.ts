
'use client';

import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message } from '@/types';

const CHAT_HISTORY_COLLECTION = 'chatHistories';


// Save a new chat message for a user
export const saveChatMessage = async (userId: string, message: Message): Promise<void> => {
  try {
    // First, ensure the user's document exists in the chatHistories collection.
    // Using setDoc with merge: true is a safe way to create it if it doesn't exist,
    // or do nothing if it does.
    const userDocRef = doc(db, CHAT_HISTORY_COLLECTION, userId);
    await setDoc(userDocRef, { lastUpdated: Timestamp.now() }, { merge: true });

    // Now, add the message to the 'messages' subcollection.
    const messagesCollectionRef = collection(userDocRef, 'messages');
    await addDoc(messagesCollectionRef, {
      ...message,
      timestamp: Timestamp.now(), // Add a server-side timestamp
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    // Add more detailed error info for easier debugging in the browser console.
    if (error instanceof Error) {
        console.error("Firebase error details:", error.name, error.message, error.stack);
    }
    throw new Error('Could not save chat message. This might be due to Firestore security rules. Make sure you have configured them in your Firebase project console to allow writes to the chatHistories collection for authenticated users.');
  }
};

// Get all chat messages for a user, ordered by timestamp
export const getChatHistory = async (userId: string): Promise<Message[]> => {
  try {
    const userChatHistoryRef = collection(db, CHAT_HISTORY_COLLECTION, userId, 'messages');
    const q = query(userChatHistoryRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);

    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        type: data.type,
        text: data.text,
        // timestamp is not part of the Message type, but is used for ordering.
      });
    });

    return messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
     if (error instanceof Error) {
        console.error("Firebase error details:", error.name, error.message, error.stack);
    }
    throw new Error('Could not retrieve chat history. This might be a Firestore security rules issue. Please check your Firebase project console.');
  }
};
