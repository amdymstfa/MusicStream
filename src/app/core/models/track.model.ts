export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  duration: number; // in seconds
  category: 'pop' | 'rock' | 'rap' | 'jazz' | 'classical' | 'electronic' | 'other';
  dateAdded: Date;
  audioData?: ArrayBuffer;
  audioBlob?: Blob;
  coverImage?: string; // Base64 encoded image (bonus feature disabled)
}

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  description?: string;
  duration: number;
  category: string;
  dateAdded: Date;
  hasCover?: boolean;
}
