import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../core/models/track.model';
import { AudioPlayerService, PlayerState } from '../../../core/services/audio-player.service';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.css']
})
export class TrackCardComponent {

  @Input({ required: true }) track!: Track;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  // exposer les streams
  currentTrack$ = this.audioPlayer.currentTrack$;
  state$ = this.audioPlayer.state$;

  constructor(private audioPlayer: AudioPlayerService) {}

  onDelete(): void {
    this.delete.emit(this.track.id);
  }

  onEdit(): void {
    this.edit.emit(this.track.id);
  }

  play(): void {
    this.audioPlayer.playTrack(this.track);
  }

  pause(): void {
    this.audioPlayer.pause();
  }

  isCurrent(trackId: string, current: Track | null): boolean {
    return current?.id === trackId;
  }
}
