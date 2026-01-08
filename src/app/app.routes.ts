import { Routes } from '@angular/router';

export const routes: Routes = [

    // default page of this app
   {
        path: '',
        redirectTo: 'library',
        pathMatch: 'full'
   },

   // default page in not found cas
   {
        path: '**',
        redirectTo: 'library'
   }
];
