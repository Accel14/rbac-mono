import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register';
import { LoginComponent } from './login/login';

export const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
