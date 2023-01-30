import { Time } from "@angular/common";

export interface userData {
  description?: string;
  location?: string;
  id?: string;
  uid: string;
  photoUrl?: string;
  phone: string;
  userAvatar?: string;
  name: string;
  email: string;
}

export interface post {
  likesCount?: any;
  comments?: any;
  postId: any;
  postAuthorId: string;
  timeStamp: number;
  title: String;
  name: String;
  phoneNumber: String;
  email: String;
  uid: String;
  imageUrl?: string;
  coverImage?: string;
  profileImage: string;
  format?: string
  followers: Array<any>;
  likes?: any;
}

export interface comment {
  userId: string;
  commentText: string;
  time: any;
}


export interface chat {
  senderId: any;
  senderName: any;
  reciverId: any;
  reciverName: any;
  message: any;
  id: any;
  uid: string;
}
