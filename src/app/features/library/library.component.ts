import { Component, OnInit } from '@angular/core';
import { Track } from '../../core/models/track.model';
import { TrackService } from '../../core/services/track.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit{

    tracks: Track[] = [];
    loading = false ;
    error: string | null = null ;

    constructor(private trackService: TrackService){}
  
    ngOnInit(): void {

      // load tracks
      this.trackService.loadTracks();

      // listen tracks
      this.trackService.tracks$.subscribe(tracks => {this.tracks = tracks});

      // listen loading
      this.trackService.loading$.subscribe(loading => {this.loading = loading});

      // listen error 
      this.trackService.error$.subscribe(error => {this.error = error});
        
    }
}
