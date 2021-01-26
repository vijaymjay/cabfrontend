import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
 import { environment } from './../../environments/environment';

export interface UserInfo {
   id: Number;
   name: String;
   lat:Number;
   lon:Number;
   in_ride:boolean;
}

@Injectable({
  providedIn: 'root'
})


export class UserService {

  constructor(private http: HttpClient) { }
  
  getuserinfo(): Observable<UserInfo[]> {
     return this.http.get<UserInfo[]>(`${environment.apiUrl}/user/info`);
  }
}
