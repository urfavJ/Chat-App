import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user';
import { RequestFriends } from '../models/requestFriends';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';  


@Injectable({
  providedIn: 'root'
})
export class FriendsRequestsService {
  private baseUrl = "http://localhost:5000/api/account"
  private token = "token";

  private httpClient = inject(HttpClient);

  GetFriendsRequestsSendByMe(senderId: string): Observable<RequestFriends[]> {
    const url = `${this.baseUrl}/firendsrequestssendbyme?senderId=${senderId}`;
  
    return this.httpClient
      .get<ApiResponse<RequestFriends[]>>(url, {
        headers: { Authorization: `Bearer ${this.getAccesstoken}` }
      })
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            return response.data;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError((error) => {
          console.error("❌ Error while fetching friend requests:", error);
          return [];
        })
      );
  }
  

  sendFriendRequest(senderId: string, receiverId: string): Observable<string> {
    console.log(senderId)
    return this.httpClient.post<ApiResponse<string>>(`${this.baseUrl}/sendfriendrequest`, {
      senderId,
      receiverId
    }).pipe(
      map((response) => {
        if (response.isSuccess) {
          return response.message;  // Zwracamy message, czyli string
        } else {
          throw new Error(response.message);  // W przypadku błędu rzucamy wyjątek
        }
      })
    );
  }

  acceptFriendRequest(senderId: string, receiverId: string): Observable<ApiResponse<string>> {

    return this.httpClient.post<ApiResponse<string>>(
      `${this.baseUrl}/acceptrequest`,
      { senderId, receiverId }
    );
  }

  getFriendRequestsForMe(receiverId: string): Observable<ApiResponse<RequestFriends[]>> {
   
    return this.httpClient.get<ApiResponse<RequestFriends[]>>(
      `${this.baseUrl}/firendsrequestsforme?receiverId=${receiverId}`
    );
  }
  

  get getAccesstoken(): string | null{
    return localStorage.getItem(this.token) || ''
  }
}
