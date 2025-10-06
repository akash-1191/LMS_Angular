import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LmsservicesService {

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
    const apiUrl = 'https://localhost:7000/api/Admin/all-instructors';
    return this.http.get(apiUrl, { headers });
  }


  acceptApprovalInstructors(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const apiUrl = `https://localhost:7000/api/Admin/approve-instructor/${id}`;
    return this.http.get(apiUrl, { headers });
  }

  RejectInstructors(id: number, data: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const apiUrl = `https://localhost:7000/api/Admin/reject-instructor/${id}`;
    return this.http.post(apiUrl, data, { headers });
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

}
