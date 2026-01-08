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
        loadComponent: () => import(
            './features/library/library.component'
        ).then(m => m.LibraryComponent)
   },

   // default page in not found cas
   {
        path: '**',
        redirectTo: 'library'
   }
];
