import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: "",
        component: Home,
    },
    {
        path: "**",
        loadComponent: () => import("./not-found/not-found").then(m => m.NotFound)
    }
];
