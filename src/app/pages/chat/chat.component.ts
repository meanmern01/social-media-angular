import { filter, Observable } from 'rxjs';
import { DatabaseService } from './../../services/database.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('sendMessageText') sendMessageText!: ElementRef;
  messages: any = [];
  sender_Id = localStorage.getItem('token');
  selectedUser = '';
  filteredMessages = this.messages;
  allUsers: any;
  reciver_Id: any;
  isSelected: boolean = false;
  reciver_Name: any;
  messages$!: Observable<any>;
  personal_Data: any;
  mergeId!: string;
  subscription!: Subscription;
  constructor(private db: DatabaseService, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.showUsers()
    this.showMessages(this.reciver_Id, this.reciver_Name)
    this.isSelected = false;
  }
  showUsers() {
    this.db.getAllUsers().subscribe((users: any) => {
      this.allUsers = users;
      this.personal_Data = this.allUsers.filter((user: any) => user.uid === this.sender_Id)
      this.allUsers = this.allUsers.filter((user: any) => user.uid !== this.sender_Id)
    }
    )

  }
  showMessages(userId: string, userName: any) {
    if (userId !== null) {
      window.dispatchEvent(new Event('resize'))
      let value = [this.sender_Id, userId]
      value.sort((a: any, b: any) => b.localeCompare(a))
      this.mergeId = value.join()
      this.db.getMessages(this.mergeId).subscribe((message: any) => {
        this.messages = message
        this.cd.detectChanges()
      })

    }

    this.reciver_Id = userId;
    this.reciver_Name = userName;
    this.isSelected = true;
  }
  sendMessage(message: any) {
    window.dispatchEvent(new Event('resize'))
    if (message) {
      let value = [this.sender_Id, this.reciver_Id]
      value.sort((a, b) => b.localeCompare(a))
      this.mergeId = value.join()

      let messages = {
        senderId: this.sender_Id,
        senderName: this.personal_Data[0].name,
        reciverId: this.reciver_Id,
        reciverName: this.reciver_Name,
        message: message,
        uid: this.mergeId,
        timestemp: +new Date()
      }
      this.db.sendMessage(messages).subscribe(data => {
        this.db.getMessages(this.mergeId).subscribe((message: any) => {
          this.messages = message
        })
      })

      this.sendMessageText.nativeElement.value = '';
    }
    return
  }

}
