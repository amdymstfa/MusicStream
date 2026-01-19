import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Track } from '../../../core/models/track.model';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [],
  templateUrl: './track-card.component.html',
  styleUrl: './track-card.component.css'
})
export class TrackCardComponent {

    // inout data from track  
    @Input({required: true}) track!: Track ;


    // output event 
    @Output() delete = new EventEmitter<string>();
    @Output() edit = new EventEmitter<string>();

    // witch on to delete 
    onDelete(): void {
      this.delete.emit(this.track.id);
    }

    // witch to edit
    onEdit(): void {
      this.edit.emit(this.track.id);
    }
}
