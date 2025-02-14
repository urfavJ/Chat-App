import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder, HttpTransportType} from "@microsoft/signalr"
import { from } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private readonly hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5000/hubs/chat', {accessTokenFactory: ()=> localStorage.getItem('token')|| '', transport: HttpTransportType.WebSockets})
    .build();
  }

  getHubConnection(): HubConnection{
    return this.hubConnection;
  }

  async connect(): Promise<void>{
    try{
      await this.hubConnection.start();
      console.log('signalR connected')
    }catch(error){
      console.log('signalR error', error)
    }
  }

   async stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  async loadMessages(id: string,page:number=1){
    try{
      await this.hubConnection.invoke('LoadMessages', id, page);
    }catch(error){
      console.error('Błąd ładowania wiadomości:', error)
    }
  }

  async sendMessage(message: Message){
    try{
      await this.hubConnection.invoke('SendMessage', message);
    }catch(error){
      console.error('Błąd wysyłania wiadomości:', error)
    }
  }

  async notifyTyping(id: string){
    try{
      await this.hubConnection.invoke('NotifyTyping', id);
    }catch(error){
      console.error('Błąd wysyłania wiadomości:', error)
    }
  }

  
}
