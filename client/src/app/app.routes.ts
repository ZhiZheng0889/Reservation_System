import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./reservations/dashboard/dashboard').then(m => m.Dashboard),
    },
    {
        path: 'reservations/new',
        loadComponent: () => import('./reservations/reservation-form/reservation-form').then(m => m.ReservationForm),
    },
    {
        path: '**',
        loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
    }
];
