'use client';
import { useState, useEffect, useCallback } from 'react';

export default function useIndexedDBStore() {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open('TextAMessSettings', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      setDb(request.result);
    };
    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
    };
  }, []);

  const putValue = useCallback(
    (key: string, value: unknown): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('DB not initialized'));
        } else {
          const transaction = db.transaction('settings', 'readwrite');
          const store = transaction.objectStore('settings');
          const req = store.put({ id: key, value });
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        }
      });
    },
    [db]
  );

  const getValue = useCallback(
    (key: string): Promise<unknown> => {
      return new Promise((resolve, reject) => {
        if (!db) {
          reject(new Error('DB not initialized'));
        } else {
          const transaction = db.transaction('settings', 'readonly');
          const store = transaction.objectStore('settings');
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        }
      });
    },
    [db]
  );

  return { db, putValue, getValue };
}
