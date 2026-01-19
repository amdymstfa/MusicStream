import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../core/services/track.service';
import { TrackMetadata } from '../../../core/models/track.model';

@Component({
  selector: 'app-edit-track',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-track.component.html',
  styleUrls: ['./edit-track.component.css']
})
export class EditTrackComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  trackId: string | null = null;
  currentTrack: TrackMetadata | null = null;
  isLoading: boolean = true;

  categories = ['pop', 'rock', 'rap', 'jazz', 'classical', 'electronic', 'other'];

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.trackId = this.route.snapshot.paramMap.get('id');
    if (this.trackId) {
      this.currentTrack = this.trackService.getTrackById(this.trackId);
      if (this.currentTrack) {
        this.initializeForm();
        this.isLoading = false;
      } else {
        this.errorMessage = 'Track not found';
        this.isLoading = false;
      }
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: [this.currentTrack?.title || '', [Validators.required, Validators.maxLength(50)]],
      artist: [this.currentTrack?.artist || '', [Validators.required, Validators.maxLength(50)]],
      category: [this.currentTrack?.category || 'pop', Validators.required],
      description: [this.currentTrack?.description || '', [Validators.maxLength(200)]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid || !this.trackId) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { title, artist, category, description } = this.form.value;

    const result = await this.trackService.updateTrack(this.trackId, {
      title,
      artist,
      category,
      description,
      file: this.selectedFile || undefined
    });

    if (result) {
      this.successMessage = 'Track updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/track', this.trackId]);
      }, 1500);
    } else {
      this.trackService.state$.subscribe(state => {
        if (state.error) {
          this.errorMessage = state.error;
        }
      });
    }

    this.isSubmitting = false;
  }

  goBack(): void {
    if (this.trackId) {
      this.router.navigate(['/track', this.trackId]);
    } else {
      this.router.navigate(['/library']);
    }
  }

  get titleError(): string {
    const control = this.form.get('title');
    if (control?.hasError('required')) return 'Title is required';
    if (control?.hasError('maxlength')) return 'Title must be 50 characters or less';
    return '';
  }

  get artistError(): string {
    const control = this.form.get('artist');
    if (control?.hasError('required')) return 'Artist name is required';
    if (control?.hasError('maxlength')) return 'Artist name must be 50 characters or less';
    return '';
  }

  get descriptionError(): string {
    const control = this.form.get('description');
    if (control?.hasError('maxlength')) return 'Description must be 200 characters or less';
    return '';
  }
}
