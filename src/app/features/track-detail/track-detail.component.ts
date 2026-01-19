import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from '../../core/services/track.service';
import { AudioPlayerService, PlayerStatus } from '../../core/services/audio-player.service';
import { TrackMetadata } from '../../core/models/track.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Track } from '../../core/models/track.model';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.css']
})
export class TrackDetailComponent implements OnInit, OnDestroy {
  track: TrackMetadata | null = null;
  playerStatus: PlayerStatus | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trackService: TrackService,
    public audioPlayer: AudioPlayerService
  ) {}

  ngOnInit(): void {
    const trackId = this.route.snapshot.paramMap.get('id');
    if (trackId) {
      this.loadTrack(trackId);
    }

    this.audioPlayer.playerStatus$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.playerStatus = status;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadTrack(trackId: string): Promise<void> {
    try {
      this.track = this.trackService.getTrackById(trackId);
      if (!this.track) {
        this.errorMessage = 'Track not found';
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Failed to load track';
      this.isLoading = false;
    }
  }

  async playTrack(): Promise<void> {
    if (!this.track) return;

    try {
      const blob = await this.trackService.getTrackBlob(this.track.id);
      if (blob) {
        const tempTrack: Track = {
          ...this.track,
          audioBlob: blob,
          category: this.track.category as 'pop' | 'rock' | 'rap' | 'jazz' | 'classical' | 'electronic' | 'other',
          dateAdded: this.track.dateAdded
        };
        this.audioPlayer.loadTrackFromBlob(tempTrack, blob);
        this.audioPlayer.play();
      }
    } catch (error) {
      this.errorMessage = 'Failed to play track';
    }
  }

  pauseTrack(): void {
    this.audioPlayer.pause();
  }

  stopTrack(): void {
    this.audioPlayer.stop();
  }

  setVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.audioPlayer.setVolume(parseFloat(input.value));
  }

  setProgress(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.audioPlayer.setCurrentTime(parseFloat(input.value));
  }

  formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  editTrack(): void {
    if (this.track) {
      this.router.navigate(['/library/edit', this.track.id]);
    }
  }

  deleteTrack(): void {
    if (this.track && confirm('Are you sure you want to delete this track?')) {
      this.trackService.deleteTrack(this.track.id).then(() => {
        this.router.navigate(['/library']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/library']);
  }

  isPlaying(): boolean {
    return this.playerStatus?.state === 'playing';
  }

  isPaused(): boolean {
    return this.playerStatus?.state === 'paused';
  }
}
