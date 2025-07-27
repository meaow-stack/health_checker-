
import {
  collection,
  addDoc,
  query,
  where,
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
    const userChatHistoryRef = collection(db, CHAT_HISTORY_COLLECTION, userId, 'messages');
    await addDoc(userChatHistoryRef, {
      ...message,
      timestamp: Timestamp.now(), // Add a server-side timestamp
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw new Error('Could not save chat message.');
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
    throw new Error('Could not retrieve chat history.');
  }
};
