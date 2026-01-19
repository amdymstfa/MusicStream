import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../core/services/track.service';
import { TrackCardComponent } from '../../shared/components/track-card/track-card.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, TrackCardComponent],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  tracks$ = this.trackService.tracks$;
  loading$ = this.trackService.loading$;
  error$ = this.trackService.error$;

  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    // load tracks
    this.trackService.loadTracks();
  }

  onDeleteTrack(id: string): void{
    this.trackService.deleteTrack(id);
  }

  onEditTrack(id: string) : void {
    console.log('Edit track', id);
    
  }

}
