import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track, TrackMetadata } from '../models/track.model';
import { StorageService } from './storage.service';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface TrackServiceState {
  tracks: TrackMetadata[];
  loadingState: LoadingState;
  error: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private stateSubject: BehaviorSubject<TrackServiceState>;
  public state$: Observable<TrackServiceState>;

  private stateInternal: TrackServiceState = {
    tracks: [],
    loadingState: 'idle',
    error: null
  };

  constructor(private storageService: StorageService) {
    this.stateSubject = new BehaviorSubject<TrackServiceState>(this.stateInternal);
    this.state$ = this.stateSubject.asObservable();
    this.loadAllTracks();
  }

  private updateState(partial: Partial<TrackServiceState>): void {
    this.stateInternal = { ...this.stateInternal, ...partial };
    this.stateSubject.next({ ...this.stateInternal });
  }

  private async loadAllTracks(): Promise<void> {
    try {
      this.updateState({ loadingState: 'loading', error: null });
      const tracks = await this.storageService.getAllMetadata();
      const sortedTracks = tracks.sort(
        (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
      this.updateState({ tracks: sortedTracks, loadingState: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tracks';
      this.updateState({ loadingState: 'error', error: errorMessage });
    }
  }

  async createTrack(
    title: string,
    artist: string,
    category: string,
    file: File,
    description?: string
  ): Promise<Track | null> {
    // Validation
    const validation = this.validateTrack(title, artist, description, file);
    if (validation.error) {
      this.updateState({ loadingState: 'error', error: validation.error });
      return null;
    }

    try {
      this.updateState({ loadingState: 'loading', error: null });

      const duration = await this.getAudioDuration(file);
      const trackId = this.generateId();

      const track: Track = {
        id: trackId,
        title: title.trim(),
        artist: artist.trim(),
        description: description?.trim(),
        duration,
        category: category as any,
        dateAdded: new Date(),
        audioBlob: file
      };

      await this.storageService.saveTrackData(track);
      await this.loadAllTracks();
      return track;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create track';
      this.updateState({ loadingState: 'error', error: errorMessage });
      return null;
    }
  }

  async updateTrack(
    trackId: string,
    updates: {
      title?: string;
      artist?: string;
      description?: string;
      category?: string;
      file?: File;
    }
  ): Promise<boolean> {
    try {
      this.updateState({ loadingState: 'loading', error: null });

      const metadata = await this.storageService.getMetadataById(trackId);
      if (!metadata) {
        throw new Error('Track not found');
      }

      const updates_clean = {
        title: updates.title?.trim() || metadata.title,
        artist: updates.artist?.trim() || metadata.artist,
        description: updates.description?.trim(),
        category: updates.category || metadata.category
      };

      // Validate
      const validation = this.validateTrack(
        updates_clean.title,
        updates_clean.artist,
        updates_clean.description,
        undefined
      );
      if (validation.error) {
        this.updateState({ loadingState: 'error', error: validation.error });
        return false;
      }

      let duration = metadata.duration;
      if (updates.file) {
        duration = await this.getAudioDuration(updates.file);
      }

      const updatedMetadata = {
        ...updates_clean,
        duration
      };

      await this.storageService.updateMetadata(trackId, updatedMetadata);

      // If file was updated, save the new audio blob
      if (updates.file) {
        const track: Track = {
          id: trackId,
          title: updates_clean.title,
          artist: updates_clean.artist,
          description: updates_clean.description,
          duration,
          category: updates_clean.category as any,
          dateAdded: metadata.dateAdded,
          audioBlob: updates.file
        };
        await this.storageService.saveTrackData(track);
      }

      await this.loadAllTracks();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update track';
      this.updateState({ loadingState: 'error', error: errorMessage });
      return false;
    }
  }

  async deleteTrack(trackId: string): Promise<boolean> {
    try {
      this.updateState({ loadingState: 'loading', error: null });
      await this.storageService.deleteTrack(trackId);
      await this.loadAllTracks();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete track';
      this.updateState({ loadingState: 'error', error: errorMessage });
      return false;
    }
  }

  getTrackById(trackId: string): TrackMetadata | null {
    return this.stateInternal.tracks.find(t => t.id === trackId) || null;
  }

  getTrackBlob(trackId: string): Promise<Blob | null> {
    return this.storageService.getTrackBlob(trackId);
  }

  getAllTracks(): TrackMetadata[] {
    return [...this.stateInternal.tracks];
  }

  searchTracks(query: string): TrackMetadata[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllTracks();

    return this.stateInternal.tracks.filter(
      track =>
        track.title.toLowerCase().includes(q) || track.artist.toLowerCase().includes(q)
    );
  }

  filterByCategory(category: string): TrackMetadata[] {
    if (!category) return this.getAllTracks();
    return this.stateInternal.tracks.filter(t => t.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.stateInternal.tracks.map(t => t.category));
    return Array.from(categories).sort();
  }

  private validateTrack(
    title: string,
    artist: string,
    description: string | undefined,
    file: File | undefined
  ): { error: string | null } {
    if (!title || title.trim().length === 0) {
      return { error: 'Title is required' };
    }
    if (title.length > 50) {
      return { error: 'Title must be 50 characters or less' };
    }
    if (!artist || artist.trim().length === 0) {
      return { error: 'Artist name is required' };
    }
    if (description && description.length > 200) {
      return { error: 'Description must be 200 characters or less' };
    }
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return { error: 'File size must be 10MB or less' };
      }
      if (!ALLOWED_FORMATS.includes(file.type)) {
        return { error: 'Only MP3, WAV, and OGG formats are supported' };
      }
    }
    return { error: null };
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(Math.round(audio.duration));
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio file'));
      };

      audio.src = url;
    });
  }

  private generateId(): string {
    return `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearAllTracks(): Promise<void> {
    return this.storageService.clearAll();
  }
}
