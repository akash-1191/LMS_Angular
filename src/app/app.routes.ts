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
import { CourseDetailComponent } from './Component/instructor-dashboard/course-detail/course-detail.component';
import { AddUnitComponent } from './Component/instructor-dashboard/add-unit/add-unit.component';
import { AddContentComponent } from './Component/instructor-dashboard/add-content/add-content.component';
import { AddQuizComponent } from './Component/instructor-dashboard/add-quiz/add-quiz.component';
import { AddQuestionsComponent } from './Component/instructor-dashboard/add-questions/add-questions.component';
import { AprovalCourseComponent } from './Component/admin-dashboard/aproval-course/aproval-course.component';
import { CourseDetailsComponent } from './Component/admin-dashboard/course-details/course-details.component';
import { FullcourseDetaildComponent } from './Component/learner-dashboard/fullcourse-detaild/fullcourse-detaild.component';
import { StartLearningComponent } from './Component/learner-dashboard/start-learning/start-learning.component';
import { QuizeStartComponent } from './Component/learner-dashboard/quize-start/quize-start.component';
import { AboutComponent } from './Component/about/about.component';

import { ContactComponent } from './Component/contact/contact.component';
import { MylmsserviecsComponent } from './Component/mylmsserviecs/mylmsserviecs.component';


export const routes: Routes = [

    {
        path: '', component: UserLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'about', component: AboutComponent },
            { path: 'services', component: MylmsserviecsComponent },
            { path: 'contact', component: ContactComponent }


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
            { path: 'InstructorReq', component: InstructorReqComponent },
            { path: 'approvalcourse/:instructorId', component: AprovalCourseComponent },
            { path: 'course-details/:courseId', component: CourseDetailsComponent }
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

            { path: 'course/:id/add-unit', component: AddUnitComponent },
            { path: 'unit/:id/add-content/:quizId', component: AddContentComponent },
            { path: 'unit/:id/add-quiz', component: AddQuizComponent },
            { path: 'unit/:id/add-questions', component: AddQuestionsComponent },
            { path: 'course-detail/:id', component: CourseDetailComponent },

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
            { path: 'certificates', component: CertificatesComponent },
            { path: 'course-details/:courseId', component: FullcourseDetaildComponent },
            { path: 'startlearning/:courseId', component: StartLearningComponent },
            { path: 'quiz/:courseId/:quizId', component: QuizeStartComponent }
        ]
    }
];
