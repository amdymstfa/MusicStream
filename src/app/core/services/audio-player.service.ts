import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/track.model';

export type PlayerState = 'playing' | 'paused' | 'stopped' | 'buffering';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  private audio = new Audio();

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private stateSubject = new BehaviorSubject<PlayerState>('stopped');
  private progressSubject = new BehaviorSubject<number>(0); 
  private volumeSubject = new BehaviorSubject<number>(1); 

  readonly currentTrack$ = this.currentTrackSubject.asObservable();
  readonly state$ = this.stateSubject.asObservable();
  readonly progress$ = this.progressSubject.asObservable();
  readonly volume$ = this.volumeSubject.asObservable();

  constructor() {
    // Progress update
    this.audio.ontimeupdate = () => {
      this.progressSubject.next(this.audio.currentTime);
    };

    // When the reading ends
    this.audio.onended = () => {
      this.stateSubject.next('stopped');
      this.progressSubject.next(0);
    };

    // Errors
    this.audio.onerror = () => {
      this.stateSubject.next('stopped');
      console.error('Audio playback error');
    };
  }

  playTrack(track: Track) {
    if (this.currentTrackSubject.value?.id !== track.id) {
      this.audio.src = track.audioUrl;
      this.currentTrackSubject.next(track);
    }

    this.audio.play();
    this.stateSubject.next('playing');
  }

  pause() {
    this.audio.pause();
    this.stateSubject.next('paused');
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.stateSubject.next('stopped');
    this.progressSubject.next(0);
  }

  seek(time: number) {
    this.audio.currentTime = time;
    this.progressSubject.next(time);
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
    this.volumeSubject.next(volume);
  }

  isPlaying(track: Track): boolean {
    return this.currentTrackSubject.value?.id === track.id && this.stateSubject.value === 'playing';
  }
}
