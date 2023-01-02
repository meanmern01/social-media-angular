import { Time } from "@angular/common";

export interface userData {
  description?: string;
  location?: string;
  id?: string;
  photoUrl?: string;
  phoneNumber: string;
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
}

export interface comment {
  userId: string;
  commentText: string;
  time: any;
}
