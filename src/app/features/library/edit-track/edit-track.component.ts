import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from '../../../core/services/track.service';
import { Track } from '../../../core/models/track.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-track',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-track.component.html',
  styleUrls: ['./edit-track.component.css']
})
export class EditTrackComponent implements OnInit {

  trackId!: string;
  track?: Track;

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', [Validators.required]],
    audioUrl: ['', Validators.required],
    coverUrl: ['']
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trackService: TrackService
  ) {}

  ngOnInit(): void {
    // Retrieve the ID from the URL
    this.trackId = this.route.snapshot.paramMap.get('id')!;

    // Retrieve the corresponding track
    this.trackService.tracks$.pipe(first()).subscribe(tracks => {
      const t = tracks.find(track => track.id === this.trackId);
      if (!t) {
        // redirection if track not found
        this.router.navigate(['/library']);
        return;
      }
      this.track = t;

      // pre-fill the form
      this.trackForm.patchValue({
        title: t.title,
        artist: t.artist,
        audioUrl: t.audioUrl,
        coverUrl: t.coverUrl
      });
    });
  }

  submit(): void {
    if (this.trackForm.invalid || !this.track) return;

    const updatedTrack: Track = {
      ...this.track,
      title: this.trackForm.value.title!,
      artist: this.trackForm.value.artist!,
      audioUrl: this.trackForm.value.audioUrl!,
      coverUrl: this.trackForm.value.coverUrl || undefined
    };

    this.trackService.updateTrack(updatedTrack);

    // back to the library
    this.router.navigate(['/library']);
  }
}
