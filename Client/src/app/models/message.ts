export interface Message{
    id: number;
    senderId: string | undefined;
    receiverId: string;
    content: string;
    isRead: boolean;
    createdDate: Date;
}