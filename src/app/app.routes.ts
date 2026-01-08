import { Routes } from '@angular/router';

export const routes: Routes = [

    // default page of this app
   {
        path: '',
        redirectTo: 'library',
        pathMatch: 'full'
   },

   // set library path
   {
        path: 'library',
        loadChildren: () => import(
            './features/library/library.routes'
        ).then(m => m.LIBRARY_ROUTES)
   },

   // set track path
   {
        path: 'track/:id',
        loadChildren: () => import(
            './features/track-detail/track-detail.routes'
        ).then(m => m.TRACK_DETAIL_ROUTES)
   },

   // set add-track path

   {
        path: 'track/add',
        loadChildren: () => import(
            './features/library/add-track/add-track.routes'
        ).then(m => m.ADD_TRACK_ROUTES) 
   },

   // set edit-track path

   {
        path: 'track/edit/:id',
        loadChildren: () => import(
            './features/library/edit-track/edit-track.routes'
        ).then(m => m.EDIT_TRACK_ROUTES)
   },

   // set resusable path component

   {},
   // default page in not found cas
   {
        path: '**',
        redirectTo: 'library'
   }
];
