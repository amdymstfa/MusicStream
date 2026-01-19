import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrackService } from '../../../core/services/track.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.css']
})
export class AddTrackComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  categories = ['pop', 'rock', 'rap', 'jazz', 'classical', 'electronic', 'other'];

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['pop', Validators.required],
      description: ['', [Validators.maxLength(200)]]
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
    if (!this.form.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select an audio file.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { title, artist, category, description } = this.form.value;

    const result = await this.trackService.createTrack(
      title,
      artist,
      category,
      this.selectedFile,
      description
    );

    if (result) {
      this.successMessage = 'Track added successfully!';
      setTimeout(() => {
        this.router.navigate(['/library']);
      }, 1500);
    } else {
      this.trackService.state$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(state => {
        if (state.error) {
          this.errorMessage = state.error;
        }
      });
    }

    this.isSubmitting = false;
  }

  goBack(): void {
    this.router.navigate(['/library']);
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
