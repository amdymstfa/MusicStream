import { Routes } from '@angular/router';
import { LibraryComponent } from './features/library/library.component';
import { AddTrackComponent } from './features/library/add-track/add-track.component';
import { EditTrackComponent } from './features/library/edit-track/edit-track.component';
import { TrackDetailComponent } from './features/track-detail/track-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/library',
    pathMatch: 'full'
  },
  {
    path: 'library',
    component: LibraryComponent
  },
  {
    path: 'library/add',
    component: AddTrackComponent
  },
  {
    path: 'library/edit/:id',
    component: EditTrackComponent
  },
  {
    path: 'track/:id',
    component: TrackDetailComponent
  },
  {
    path: '**',
    redirectTo: '/library'
  }
];
