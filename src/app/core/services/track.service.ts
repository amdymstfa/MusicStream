import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

      // private source
      private trackSubject = new BehaviorSubject<Track[]>([]);
      private loadingSubject = new BehaviorSubject<boolean>(false);
      private errorSubject = new BehaviorSubject<string | null>(null);

       // plublic flux 
      readonly tracks$ = this.trackSubject.asObservable();
      readonly loading$ = this.loadingSubject.asObservable();
      readonly error$ = this.errorSubject.asObservable();

      constructor(private storage: StorageService) { }

      // load tracks
      loadTracks(): void {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        try {

          // storage service
          // const tracks: Track[] = [];

          const tracks = this.storage.getTracks();
          this.trackSubject.next(tracks);
          this.loadingSubject.next(false);

        }catch(error){
          this.loadingSubject.next(false);
          this.errorSubject.next("Error loading tracks");
        }
      }


      // Add track
      addTrack(track : Track): void {
          this.loadingSubject.next(true);

          const updatedTracks = [...this.trackSubject.value, track];
          this.trackSubject.next(updatedTracks);
          this.storage.saveTracks(updatedTracks);
          this.loadingSubject.next(false);
      }

      // delete track
      deleteTrack(id : string) : void {
        this.loadingSubject.next(true);

        const updatedTracks = this.trackSubject.value.filter(
            track => track.id != id 
        );

        this.trackSubject.next(updatedTracks);
        this.storage.saveTracks(updatedTracks);
        this.loadingSubject.next(false);
      }


      // update track
      updateTrack(track : Track) : void {

        this.loadingSubject.next(true);

        const updatedTracks = this.trackSubject.value.map(
          t => t.id === track.id ? track : t
        );

        this.trackSubject.next(updatedTracks);
        this.storage.saveTracks(updatedTracks);
        this.loadingSubject.next(false);
      }

}
