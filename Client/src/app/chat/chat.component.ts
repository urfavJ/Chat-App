import { Component, inject, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { User } from '../models/user';
import { AppUser } from '../models/appUser';
import { Message } from '../models/message';
import { FriendsRequestsComponent } from '../friends-requests/friends-requests.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatSnackBar} from "@angular/material/snack-bar"
import { MatIconModule } from '@angular/material/icon';
import { AuthServiceService } from '../services/auth-service.service';


@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, MatIconModule, FriendsRequestsComponent],
  providers: [SignalrService],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  users: User[]=[]
  allUsers: User[] = []
  mainUser: AppUser | null = null;
  selectedChatId : string | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  typingUser: string | null = null;
  typingTimeout: any;
  senderUser:User | undefined = undefined;
  searchTerm: string = '';

  menuOpen: boolean = false;

  private snackBar = inject(MatSnackBar);

  constructor(private signalrService: SignalrService , private authServiceService: AuthServiceService ) {}

  ngOnInit(): void {
    this.updateUserData();
    this.connectSignalR();
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser: AppUser = JSON.parse(userData);
      this.mainUser = {
        id: parsedUser.id,
        email: parsedUser.email,
        userName: parsedUser.userName,
        fullName: parsedUser.fullName,
        profileImage: parsedUser.profileImage,
        friendsId: parsedUser.friendsId
      }}
      console.log(this.users)
      console.log(this.mainUser)
  }

  ngOnDestroy(): void {
    this.signalrService.stopConnection(); 
  }

  private connectSignalR(){
    this.signalrService.connect().then(()=>{
      this.signalrService.getHubConnection().on('OnlineUsers',(usersSignalR: User[])=>{
        this.users = usersSignalR;
        this.users = this.users.filter(user => user.id !== this.mainUser?.id);
        this.allUsers = this.users.filter(user => !(this.mainUser?.friendsId?.includes(user.id) ?? false));
        this.users = this.users.filter(user => this.mainUser?.friendsId?.includes(user.id) ?? false);
        

      });

      this.signalrService.getHubConnection().on('ReceiveMessageList', (messages: Message[]) => {
        this.messages = messages;
      });
  
      this.signalrService.getHubConnection().on('ReceiveNewMessage', (message: Message) => {
        if (message.senderId === this.selectedChatId || message.receiverId === this.selectedChatId) {
          this.messages.push(message);
        }
      });

      this.signalrService.getHubConnection().on('NotifyTypingToUser', (userName: string) => {
        this.typingUser = userName;
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => this.typingUser = null, 3000); 
      });
      
      this.signalrService.getHubConnection().on('Notify', (user: User) => {
        this.snackBar.open(user.fullName+" is online.", 'OK', {
          duration: 3000, 
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    });
  }

  private updateUserData(): void {
    this.authServiceService.me().subscribe(
      (response) => {
        if (response.isSuccess && response.data) {
          // Zaktualizuj dane użytkownika w localStorage
          localStorage.setItem('user', JSON.stringify(response.data));
          
        } else {
          console.error('Failed to fetch user data');
        }
      },
      (error) => {
        console.error('Error occurred while fetching user data:', error);
      }
    );
  }

  async setChat(id: string){
    this.selectedChatId = id;
    this.messages = []; 
    this.senderUser = this.users.find((x)=> x.id==id)
    this.signalrService.loadMessages(id);
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChatId) return;
  
    const message : Message = {
      id: 1,
    senderId: this.mainUser?.id,
    receiverId: this.selectedChatId,
    content: this.newMessage,
    isRead: false,
    createdDate: new Date()
    };
    this.signalrService.sendMessage(message);
    this.messages.push(message);
    this.newMessage = '';
  }

  onTyping() {
    if (!this.senderUser?.userName) return;
    
    this.signalrService.notifyTyping(this.senderUser?.userName);
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen; 
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
  }

  filteredUsers() {
    if (!this.searchTerm) {
      return this.users; 
    }
    return this.users.filter(user =>
      user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
