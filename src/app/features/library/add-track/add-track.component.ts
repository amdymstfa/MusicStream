import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrackService } from '../../../core/services/track.service';
import { Track } from '../../../core/models/track.model';

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.css']
})
export class AddTrackComponent {

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private router: Router
  ) {}

  trackForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    artist: ['', [Validators.required]],
    audioUrl: ['', Validators.required],
    coverUrl: ['']
  });

  submit(): void {
    if (this.trackForm.invalid) return;

    const newTrack: Track = {
      id: crypto.randomUUID(),
      title: this.trackForm.value.title!,
      artist: this.trackForm.value.artist!,
      audioUrl: this.trackForm.value.audioUrl!,
      coverUrl: this.trackForm.value.coverUrl || undefined,
      duration: 0,
    };

    this.trackService.addTrack(newTrack);

    this.router.navigate(['/library']);
  }
}
