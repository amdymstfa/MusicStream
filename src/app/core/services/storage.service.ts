import { Injectable } from '@angular/core';
import { Track, TrackMetadata } from '../models/track.model';

const DB_NAME = 'musicstream_db';
const DB_VERSION = 1;
const STORE_NAME_TRACKS = 'tracks';
const STORE_NAME_METADATA = 'metadata';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database initialization failed');
    };

    request.onsuccess = () => {
      this.db = request.result;
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_NAME_METADATA)) {
        const metadataStore = db.createObjectStore(STORE_NAME_METADATA, { keyPath: 'id' });
        metadataStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        metadataStore.createIndex('category', 'category', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_NAME_TRACKS)) {
        db.createObjectStore(STORE_NAME_TRACKS, { keyPath: 'id' });
      }
    };
  }

  private getDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
      } else {
        const checkInterval = setInterval(() => {
          if (this.db) {
            clearInterval(checkInterval);
            resolve(this.db);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Database initialization timeout'));
        }, 5000);
      }
    });
  }

  async saveTrackData(track: Track): Promise<void> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_TRACKS, STORE_NAME_METADATA], 'readwrite');

    // Save audio data
    if (track.audioBlob) {
      const audioStore = transaction.objectStore(STORE_NAME_TRACKS);
      const audioData = {
        id: track.id,
        blob: track.audioBlob
      };
      audioStore.put(audioData);
    }

    // Save metadata
    const metadata: TrackMetadata = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      description: track.description,
      duration: track.duration,
      category: track.category,
      dateAdded: track.dateAdded,
      hasCover: !!track.coverImage
    };

    const metadataStore = transaction.objectStore(STORE_NAME_METADATA);
    metadataStore.put(metadata);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getTrackBlob(trackId: string): Promise<Blob | null> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_TRACKS], 'readonly');
    const store = transaction.objectStore(STORE_NAME_TRACKS);
    const request = store.get(trackId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result?.blob || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMetadata(): Promise<TrackMetadata[]> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_METADATA], 'readonly');
    const store = transaction.objectStore(STORE_NAME_METADATA);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMetadataById(trackId: string): Promise<TrackMetadata | null> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_METADATA], 'readonly');
    const store = transaction.objectStore(STORE_NAME_METADATA);
    const request = store.get(trackId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTrack(trackId: string): Promise<void> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_TRACKS, STORE_NAME_METADATA], 'readwrite');

    transaction.objectStore(STORE_NAME_TRACKS).delete(trackId);
    transaction.objectStore(STORE_NAME_METADATA).delete(trackId);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async updateMetadata(trackId: string, metadata: Partial<TrackMetadata>): Promise<void> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_METADATA], 'readwrite');
    const store = transaction.objectStore(STORE_NAME_METADATA);
    const request = store.get(trackId);

    request.onsuccess = () => {
      const existing = request.result;
      if (existing) {
        store.put({ ...existing, ...metadata });
      }
    };

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clearAll(): Promise<void> {
    const db = await this.getDb();
    const transaction = db.transaction([STORE_NAME_TRACKS, STORE_NAME_METADATA], 'readwrite');

    transaction.objectStore(STORE_NAME_TRACKS).clear();
    transaction.objectStore(STORE_NAME_METADATA).clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}
