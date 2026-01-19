import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../models/track.model';

export type PlayerState = 'playing' | 'paused' | 'stopped' | 'buffering';

export interface PlayerStatus {
  state: PlayerState;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audioElement: HTMLAudioElement;
  private playerStatusSubject: BehaviorSubject<PlayerStatus>;
  public playerStatus$: Observable<PlayerStatus>;

  private statusInternal: PlayerStatus = {
    state: 'stopped',
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isLoading: false
  };

  constructor() {
    this.audioElement = new Audio();
    this.setupAudioElement();
    this.playerStatusSubject = new BehaviorSubject<PlayerStatus>(this.statusInternal);
    this.playerStatus$ = this.playerStatusSubject.asObservable();
  }

  private setupAudioElement(): void {
    this.audioElement.crossOrigin = 'anonymous';

    this.audioElement.addEventListener('loadstart', () => {
      this.updateStatus({ isLoading: true });
    });

    this.audioElement.addEventListener('canplay', () => {
      this.updateStatus({ isLoading: false });
    });

    this.audioElement.addEventListener('play', () => {
      this.updateStatus({ state: 'playing' });
    });

    this.audioElement.addEventListener('pause', () => {
      this.updateStatus({ state: 'paused' });
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateStatus({
        currentTime: this.audioElement.currentTime,
        duration: this.audioElement.duration
      });
    });

    this.audioElement.addEventListener('ended', () => {
      this.updateStatus({ state: 'stopped' });
    });

    this.audioElement.addEventListener('error', () => {
      console.error('Audio playback error');
      this.updateStatus({ isLoading: false, state: 'stopped' });
    });
  }

  loadTrack(track: Track, audioUrl: string): void {
    try {
      this.audioElement.src = audioUrl;
      this.updateStatus({ currentTrack: track, isLoading: true });
    } catch (error) {
      console.error('Error loading track:', error);
    }
  }

  loadTrackFromBlob(track: Track, blob: Blob): void {
    try {
      const url = URL.createObjectURL(blob);
      this.audioElement.src = url;
      this.updateStatus({ currentTrack: track, isLoading: true });
    } catch (error) {
      console.error('Error loading track from blob:', error);
    }
  }

  play(): void {
    if (this.audioElement.src) {
      this.audioElement.play().catch(error => {
        console.error('Play error:', error);
      });
    }
  }

  pause(): void {
    this.audioElement.pause();
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.updateStatus({ state: 'stopped', currentTime: 0 });
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.audioElement.volume = normalizedVolume;
    this.updateStatus({ volume: normalizedVolume });
  }

  setCurrentTime(time: number): void {
    this.audioElement.currentTime = Math.max(0, Math.min(time, this.audioElement.duration || 0));
    this.updateStatus({ currentTime: this.audioElement.currentTime });
  }

  getCurrentTime(): number {
    return this.audioElement.currentTime;
  }

  getDuration(): number {
    return this.audioElement.duration || 0;
  }

  getStatus(): PlayerStatus {
    return { ...this.statusInternal };
  }

  private updateStatus(partial: Partial<PlayerStatus>): void {
    this.statusInternal = { ...this.statusInternal, ...partial };
    this.playerStatusSubject.next({ ...this.statusInternal });
  }

  unloadTrack(): void {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.updateStatus({
      currentTrack: null,
      currentTime: 0,
      duration: 0,
      state: 'stopped'
    });
  }
}
