
import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '' ,loadChildren: () => import('./modules/home/home.routes').then(mod => mod.HOME_ROUTES)
    },

    {
        path: '**', loadComponent: () => import('././shared/components/page-not-found/page-not-found.component').then(mod => mod.PageNotFoundComponent)
    }
];
