import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { SignupComponent } from './Component/signup/signup.component';
import { AdminDashboardComponent } from './Component/admin-dashboard/admin-dashboard.component';
import { authGuard } from './auth/auth.guard';
import { InstructorDashboardComponent } from './Component/instructor-dashboard/instructor-dashboard.component';
import { LearnerDashboardComponent } from './Component/learner-dashboard/learner-dashboard.component';
import { HomeComponent } from './Component/home/home.component';
import { UserLayoutComponent } from './Component/user-layout/user-layout.component';

export const routes: Routes = [

    {
        path: '', component: UserLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
        ]
    },

    {
        path: 'admin-dashboard', component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'Admin' },
        children: []
    },


    {
        path: 'instructor-dashboard',
        component: InstructorDashboardComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'Instructor' },
        children:[]
    },


    {
        path: 'learner-dashboard',
        component: LearnerDashboardComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'Learner' },
        children:[]
    }
];
