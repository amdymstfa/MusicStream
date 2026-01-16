import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private readonly STORAGE_KEY = 'musicstream_tracks';

  getTracks() : Track[] {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [] ;
  }

  saveTracks( tracks : Track[]) : void {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tracks));
  }

  clear() : void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
