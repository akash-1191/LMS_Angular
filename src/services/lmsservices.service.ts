import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LmsservicesService {

  constructor(private http:HttpClient) { }



  //login api
  Login(data:any):Observable<any>{
    var url="https://localhost:7000/api/login"
    return this.http.post(url,data);
  }

  registration(data:any):Observable<any>{
    var url="https://localhost:7000/api/register"
    return this.http.post(url ,data);
  }
}
