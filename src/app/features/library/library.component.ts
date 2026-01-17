import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../core/services/track.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
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
}
