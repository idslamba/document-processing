import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
    {
        path: '', loadComponent: () => import('../home/home.component').then(mod => mod.HomeComponent),
        children: [
            {
                path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
            {
                path: 'dashboard', loadComponent: () => import('../dashboard/dashboard.component').then(mod => mod.DashboardComponent)
            },
            {
                path: 'upload-document', loadComponent: () => import('../upload-document/upload-document.component').then(mod => mod.UploadDocumentComponent)
            },
            {
                path: 'view-submissions', loadComponent: () => import('../view-submissions/view-submissions.component').then(mod => mod.ViewSubmissionsComponent)
            },
            {
                path: 'view-submissions/:id', loadComponent: () => import('../selected-document/selected-document.component').then(mod => mod.SelectedDocumentComponent)
            },
            {
                path: 'view-submissions/details/:id', loadComponent: () => import('../view-details/view-details.component').then(mod => mod.ViewDetailsComponent)
            },
            {
                path: 'reports', loadComponent: () => import('../report/report.component').then(mod => mod.ReportComponent)
            },
            {
                path: '**', loadComponent: () => import('../../shared/components/page-not-found/page-not-found.component').then(mod => mod.PageNotFoundComponent)
            }
        ]
    }

];
