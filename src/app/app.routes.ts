import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';
import { Profile } from './profile/profile';
import { UsersList } from './users-list/users-list';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'users',
        component: UsersList
    },
    {
        path: 'users/:id',
        component: Profile
    }
];
