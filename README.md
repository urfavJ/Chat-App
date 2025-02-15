# Chat-App 📬  
A real-time messaging application built using **ASP.NET Core Web API**, **SignalR**, **Angular**, and **SQLite**.  

## Features  
- ✅ **User Authentication** – Login & Registration screens  
- ✅ **Real-time Friend Status** – See if your friends are online or offline  
- ✅ **Friend Requests** – Send, accept, or wait for confirmation of friend requests  
- ✅ **Live Chat** – Instant messaging with real-time typing indicators  
- ✅ **Notifications** – Get notified when a friend logs in  

## UI Overview  
<ul>  
  <li><strong>Main Screen:</strong>  
    <ul>  
      <li><strong>Top-left corner</strong> – Displays your profile picture and personal information</li>  
      <li><strong>Left sidebar:</strong>  
        <ul>  
          <li><strong>Your friends</strong> – Shows online/offline status in real-time</li>  
          <li><strong>Other users</strong> – Non-friends that you can send a friend request to</li>  
        </ul>  
      </li>  
      <li><strong>Center</strong> – Chat window with a selected friend</li>  
      <li><strong>Right sidebar</strong> – Friend’s profile picture, name, and email</li>  
      <li><strong>Typing indicator</strong> – See when a friend is typing (displayed in the chat and next to their name in the friend list)
      <img width="1600" alt="Image" src="https://github.com/user-attachments/assets/5a82c32c-f453-482e-b097-c6a887c7e3ac" />
      </li>  
      <li><strong>Online notification</strong> – Get notified when a friend logs in
      <img width="1600" alt="Image" src="https://github.com/user-attachments/assets/b334c834-cbde-4c85-b1d6-9a8598e63dcf" />
      </li>  
    </ul> 
  </li> 
  <li><strong>Login & Registration Screens</strong> – Simple authentication flow
  <img width="1600" alt="Image" src="https://github.com/user-attachments/assets/d5f1a39c-42b1-4841-a98d-697ad5b080e9" />
  <img width="1600" alt="Image" src="https://github.com/user-attachments/assets/17b33112-4981-47c7-abea-46904cfcf93a" />
  </li> 
</ul>  

## Tech Stack  
- **Backend**: ASP.NET Core Web API, SignalR  
- **Frontend**: Angular  
- **Database**: SQLite  

## Setup Instructions  

### 1. Clone the repository  
```sh
git clone https://github.com/Bielako223/Chat-App.git 
cd chat-app
```
### 2. Backend Setup
- Navigate to the API project
- Install dependencies:  
```sh
dotnet restore
```
- Run the application:
```sh
dotnet run
```
### 3. Frontend Setup
- Navigate to the Angular project
- Install dependencies:
```sh
npm install
```
- Start the frontend:
```sh
ng serve
```
- Open the app in your browser at http://localhost:4200















