import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LmsservicesService {


  private apiUrl = 'https://localhost:7000/api';
  constructor(private http: HttpClient) { }



  //login api
  Login(data: any): Observable<any> {
    var url = "https://localhost:7000/api/login"
    return this.http.post(url, data);
  }

  registration(data: any, options?: any) {
    return this.http.post('https://localhost:7000/api/register', data, { ...options });
  }



  getProfileData(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `https://localhost:7000/api/profile`;
    return this.http.get(url, { headers });
  }


  // Update profile data
  updateProfileData(userId: number, data: any): Observable<any> {
    const formData = new FormData();
    formData.append('FullName', data.fullName);
    formData.append('PhoneNumber', data.phoneNumber);
    formData.append('Age', data.age);
    formData.append('Gender', data.gender);
    formData.append('Address', data.address);

    const url = `https://localhost:7000/api/update-profile/${userId}`;
    return this.http.put(url, formData, {
      responseType: 'text' as 'json'
    });
  }

  // Update profile picture
  updateProfilePic(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('ProfilePicFile', file, file.name);

    const url = `https://localhost:7000/api/update-profile-pic/${userId}`;
    return this.http.put(url, formData, {
      responseType: 'text' as 'json'
    });
  }

  getAllInstructors(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const apiUrlg = 'https://localhost:7000/api/Admin/all-instructors';
    return this.http.get(apiUrlg, { headers });
  }

  acceptApprovalInstructors(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const apiUrla = `https://localhost:7000/api/Admin/approve-instructor/${id}`;
    return this.http.put(apiUrla, {}, { headers });
  }


  RejectInstructors(id: number, data: { reason: string }): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const apiUrlr = `https://localhost:7000/api/Admin/reject-instructor/${id}`;
    return this.http.put(apiUrlr, data, { headers });
  }

  // Deactivate User API
  deactivateUser(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/Admin/deactivate-user/${userId}`;
    return this.http.put(url, null, { headers, responseType: 'text' });
  }

  // Activate User API
  activateUser(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/Admin/activate-user/${userId}`;
    return this.http.put(url, null, { headers, responseType: 'text' });
  }


  getAllLearner(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = "https://localhost:7000/api/Admin/all-learners";
    return this.http.get(url, { headers });
  }





  //use all bearer this tooken function 
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

  }


  // 1. Create Course
  createCourse(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create_course`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  //  2. Get Courses (My Courses)
  getCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Get_Courses`, {
      headers: this.getAuthHeaders()
    });
  }

  //  3. Add Unit
  addUnit(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add_Unit`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  //  4. Add Unit Content (video)
  addUnitContent(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add_Unit_Content`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  //  5. Create Quiz
  createQuiz(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create_Quiz`, data, {
      headers: this.getAuthHeaders()
    });
  }


  //6 create Questions
  createQuqstions(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create_Question`, data, {
      headers: this.getAuthHeaders()
    });
  }

  //  7. Get Quiz by CourseId
  getQuizByCourseId(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetQuizeByCourse/${courseId}`, {
      headers: this.getAuthHeaders()
    });
  }

  //  8. Create Question
  createQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create_Question`, data, {
      headers: this.getAuthHeaders()
    });
  }


  // 9 get all unit by course
  getUnitsByCourse(courseId: number) {
    return this.http.get<any[]>(`https://localhost:7000/api/UnitsByCourse/${courseId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // get uploaded content by course  
  getUploadedContentsByCourse(courseId: number) {
    return this.http.get<any[]>(`https://localhost:7000/api/contents/by-course/${courseId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getQuizzesByCourse(courseId: number) {
    return this.http.get<any[]>(`https://localhost:7000/api/Quizzesby-course/${courseId}`, {
      headers: this.getAuthHeaders()
    });
  }



  //get aal course my instructor id   
  getInstructorAllCourses(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = 'https://localhost:7000/api/instructor-my-courses';
    return this.http.get<any>(url, { headers });
  }

  getInstructorCourseById(courseId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `https://localhost:7000/api/instructor-my-courses/${courseId}`;
    return this.http.get<any>(url, { headers });
  }


  //update unit data
  updateUnit(payload: any): Observable<any> {
    const urlis = "https://localhost:7000/api/Unit/updateUnit";
    return this.http.put(urlis, payload, {
      headers: this.getAuthHeaders()
    });
  }


  //delete unit
  deleteUnit(unitId: number): Observable<any> {
    const url = `https://localhost:7000/api/Unit/delete/${unitId}`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders()
    });
  }


  //update Quize
  updateQuiz(quizId: number, updatedQuiz: any): Observable<any> {
    const url = `https://localhost:7000/api/Unit/update-quiz/${quizId}`;
    return this.http.put(url, updatedQuiz, {
      headers: this.getAuthHeaders()
    });
  }


  //delete Question
  deleteQuestion(questionId: number): Observable<any> {
    const url = `https://localhost:7000/api/Unit/DeleteQuestion/${questionId}`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders()
    });
  }


  //delete content
  deleteContent(contentId: number): Observable<any> {
    const url = `https://localhost:7000/api/Unit/delete-content/${contentId}`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders()
    });
  }

  //update course 
  updateCourse(courseId: number, formData: FormData): Observable<any> {
    const url = `https://localhost:7000/api/Unit/Update_course/${courseId}`;
    return this.http.put(url, formData, {
      headers: this.getAuthHeaders()
    });
  }


  //delete th course 

  deleteCourse(courseId: number): Observable<any> {
    const url = `https://localhost:7000/api/Unit/Delete_course/${courseId}`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders()
    });
  }




  //  1️Get all instructors
  getAllInstructorsData(): Observable<any[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `https://localhost:7000/api/all-instructors`;
    return this.http.get<any[]>(url, { headers });
  }


  //  Get courses by a specific instructor (by instructorId)
  getInstructorCoursesByAdmin(instructorId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `https://localhost:7000/api/admin/instructor-courses/${instructorId}`;
    return this.http.get<any>(url, { headers });
  }



  approveCourse(courseId: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`https://localhost:7000/api/course/approve/${courseId}`, {}, { headers });
  }

  rejectCourse(courseId: number, reason: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`https://localhost:7000/api/course/reject/${courseId}`, { reason }, { headers });
  }


  //student apis 


  // Student side: get all approved courses
  getAllCoursesForStudent(): Observable<any[]> {
    const url = 'https://localhost:7000/api/StudentCourses/courses';
    return this.http.get<any[]>(url);
  }


  getLearnerCourseById(courseId: number): Observable<any> {
    const url = `https://localhost:7000/api/StudentCourses/learner-my-course/${courseId}`;
    return this.http.get<any>(url);
  }


  enrollCourse(courseId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `https://localhost:7000/api/StudentCourses/enroll_course`;
    return this.http.post<any>(url, { courseId }, { headers });
  }

  getEnrolledCourses(): Observable<any[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/StudentCourses/enrolledByLearner`;
    return this.http.get<any[]>(url, { headers });
  }


  getLearnerCourseByIdfor(courseId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `https://localhost:7000/api/StudentCourses/learner-my-course/${courseId}`;
    return this.http.get<any>(url, { headers });
  }

  getQuizByCourse(courseId: number, quizId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `https://localhost:7000/api/StudentCourses/learner-course-quiz/${courseId}/${quizId}`;
    return this.http.get<any>(url, { headers });
  }



  //  Start Unit
  startUnit(courseId: number, unitId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = 'https://localhost:7000/api/progress/start';
    const body = { courseId, unitId };
    return this.http.post<any>(url, body, { headers });
  }

  //  Complete Unit Progress
  completeUnit(courseId: number, unitId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = 'https://localhost:7000/api/progress/complete';
    const body = { courseId, unitId };
    return this.http.post<any>(url, body, { headers });
  }

  //  Get Course Progress
  getCourseProgress(courseId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/progress/course-progress/${courseId}`;
    return this.http.get<any>(url, { headers });
  }



  submitQuizAttempt(attemptData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = 'https://localhost:7000/api/QuizAttempt/submit';
    return this.http.post<any>(url, attemptData, { headers });
  }
  //  Get All Attempts for a User
  getUserAttempts(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/QuizAttempt/user/${userId}`;
    return this.http.get<any>(url, { headers });
  }

  // Get All Attempts for a Course
  getCourseAttempts(courseId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/QuizAttempt/course/${courseId}`;
    return this.http.get<any>(url, { headers });
  }

  //  Get Single Attempt by Attempt ID
  getAttemptById(attemptId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/QuizAttempt/${attemptId}`;
    return this.http.get<any>(url, { headers });
  }

  checkQuizAttempt(userId: number, courseId: number, quizId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `https://localhost:7000/api/QuizAttempt/check?userId=${userId}&courseId=${courseId}&quizId=${quizId}`;
    return this.http.get<any>(url, { headers });
  }





}
