import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { SignupComponent } from './Component/signup/signup.component';
import { AdminDashboardComponent } from './Component/admin-dashboard/admin-dashboard.component';
import { authGuard } from './auth/auth.guard';
import { InstructorDashboardComponent } from './Component/instructor-dashboard/instructor-dashboard.component';
import { LearnerDashboardComponent } from './Component/learner-dashboard/learner-dashboard.component';
import { HomeComponent } from './Component/home/home.component';
import { UserLayoutComponent } from './Component/user-layout/user-layout.component';
import { ProfileComponent } from './Component/instructor-dashboard/profile/profile.component';
import { LearprofileComponent } from './Component/learner-dashboard/learprofile/learprofile.component';
import { ManageUsersComponent } from './Component/admin-dashboard/manage-users/manage-users.component';
import { ManageCoursesComponent } from './Component/admin-dashboard/manage-courses/manage-courses.component';
import { DashboardComponent } from './Component/instructor-dashboard/dashboard/dashboard.component';
import { InstCourseComponent } from './Component/instructor-dashboard/inst-course/inst-course.component';
import { CreateCourseComponent } from './Component/instructor-dashboard/create-course/create-course.component';
import { StudentsEnrollmentsComponent } from './Component/instructor-dashboard/students-enrollments/students-enrollments.component';
import { LearAshboardComponent } from './Component/learner-dashboard/lear-ashboard/lear-ashboard.component';
import { MyCoursesComponent } from './Component/learner-dashboard/my-courses/my-courses.component';
import { ExploreCoursesComponent } from './Component/learner-dashboard/explore-courses/explore-courses.component';
import { CertificatesComponent } from './Component/learner-dashboard/certificates/certificates.component';
import { AdmDashborrdComponent } from './Component/admin-dashboard/adm-dashborrd/adm-dashborrd.component';
import { InstructorReqComponent } from './Component/admin-dashboard/instructor-req/instructor-req.component';

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
        children: [
            { path: '', component: AdmDashborrdComponent },
            { path: 'manageuser', component: ManageUsersComponent },
            { path: 'managecourse', component: ManageCoursesComponent },
            { path: 'InstructorReq', component: InstructorReqComponent }
        ]
    },


    {
        path: 'instructor-dashboard',
        component: InstructorDashboardComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'Instructor' },
        children: [
            { path: '', component: ProfileComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'mycourse', component: InstCourseComponent },
            { path: 'createcourse', component: CreateCourseComponent },
            { path: 'studentsenrollments', component: StudentsEnrollmentsComponent },
        ]
    },


    {
        path: 'learner-dashboard',
        component: LearnerDashboardComponent,
        canActivate: [authGuard],
        data: { expectedRole: 'Learner' },
        children: [
            { path: '', component: LearprofileComponent },
            { path: 'dashboard', component: LearAshboardComponent },
            { path: 'mycourse', component: MyCoursesComponent },
            { path: 'explorecourses', component: ExploreCoursesComponent },
            { path: 'certificates', component: CertificatesComponent }
        ]
    }
];
