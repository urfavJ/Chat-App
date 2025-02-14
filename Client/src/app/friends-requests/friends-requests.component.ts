import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user';
import { AppUser } from '../models/appUser';
import { RequestFriends } from '../models/requestFriends';
import { FriendsRequestsService } from '../services/friends-requests.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-friends-requests',
  imports: [CommonModule, FormsModule],
  templateUrl: './friends-requests.component.html',
  styleUrl: './friends-requests.component.css'
})
export class FriendsRequestsComponent implements OnInit {
  @Input() user! :AppUser | null;
  @Input() allUsers! :User[];

  waitingRequests : RequestFriends[] =[];
  alreadySendedReq: RequestFriends[] =[];


  constructor(private friendsRequestsService: FriendsRequestsService) {}

  ngOnInit() : void{
    if (this.user?.id) {
      this.friendsRequestsService.GetFriendsRequestsSendByMe(this.user.id).subscribe(
        (data) => {
          this.alreadySendedReq = data; 
        },
        (error) => {
          console.error('Error occurred while fetching friend requests:', error);
        }
      );
      this.friendsRequestsService.getFriendRequestsForMe(this.user.id).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.waitingRequests = response.data;
          } else {
            console.error('Failed to fetch friend requests:', response.message);
          }
        },
        (error) => {
          console.error('Error occurred while fetching friend requests:', error);
        }
      );
    }

  }


  sendRequest(receiverId: string): void {
    if (!this.user?.id) {
      console.error("User ID is missing");
      return;
    }
  
    this.friendsRequestsService.sendFriendRequest(this.user.id, receiverId).subscribe(
      (message) => {
        // Obsługuje sukces
        console.log('Friend request sent:', message);
        this.alreadySendedReq.push({
          id: 1, 
          senderId: this.user!.id, 
          receiverId: receiverId
        })
      },
      (error) => {
        // Obsługuje błąd
        console.error('Error occurred while sending friend request:', error);
        // Możesz dodać logikę obsługi błędu
      }
    );
  }
  

  isRequestSent(userId: string): boolean {
    return this.alreadySendedReq.some(req => req.receiverId === userId);
  }

  confirmRequest(senderId: string): void {
    if (!this.user?.id) {
      console.error("User ID is missing");
      return;
    }

    this.friendsRequestsService.acceptFriendRequest(senderId, this.user?.id).subscribe(
      (message) => {
        console.log('Friend request accepted:', message);
        // Zaktualizuj UI po zaakceptowaniu zaproszenia
        this.waitingRequests = this.waitingRequests.filter(
          (request) => request.senderId !== senderId
        );
        this.allUsers = this.allUsers.filter(user => user.id !== senderId);
      },
      (error) => {
        console.error('Error occurred while accepting friend request:', error);
      }
    );
  }

  isRequestWaiting(requestId: string): boolean {
    return this.waitingRequests.some(req => req.senderId === requestId);
  }

}
