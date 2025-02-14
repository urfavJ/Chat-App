export interface User{
    id: string;
    connectionId: string;
    userName: string;
    fullName: string;
    profilePicture: string;
    isOnline: boolean;
    unreadCount: string;
    email: string;
    friendsId: string[];
}