import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TrackService } from '../../core/services/track.service';
import { TrackCardComponent } from '../../shared/components/track-card/track-card.component';
import { TrackMetadata } from '../../core/models/track.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TrackCardComponent],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = '';
  filteredTracks: TrackMetadata[] = [];
  allCategories: string[] = [];

  constructor(
    public trackService: TrackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trackService.state$.subscribe(state => {
      this.applyFilters();
      this.allCategories = this.trackService.getCategories();
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.trackService.getAllTracks();

    if (this.searchQuery.trim()) {
      filtered = this.trackService.searchTracks(this.searchQuery);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(track => track.category === this.selectedCategory);
    }

    this.filteredTracks = filtered;
  }

  goToTrackDetail(trackId: string): void {
    this.router.navigate(['/track', trackId]);
  }

  goToAddTrack(): void {
    this.router.navigate(['/library/add']);
  }

  editTrack(trackId: string): void {
    this.router.navigate(['/library/edit', trackId]);
  }

  async deleteTrack(trackId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this track?')) {
      await this.trackService.deleteTrack(trackId);
    }
  }
}
