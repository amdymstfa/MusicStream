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

   // default page in not found cas
   {
        path: '**',
        redirectTo: 'library'
   }
];
