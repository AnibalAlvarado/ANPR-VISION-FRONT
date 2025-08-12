import { OnInit } from '@angular/core';
// angular import
import { Component, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { General } from 'src/app/generic/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, ChatUserListComponent, ChatMsgComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit {
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;

  private service = inject(General);
  private route = inject(Router);

  userName: string | null = null;


  // constructor
  constructor() {
    this.visibleUserList = false;
    this.chatMessage = false;
  }

 ngOnInit(): void {
    this.userName = this.service.getUsername();
  }
  // public method
  // eslint-disable-next-line
  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }
cerrarSesion() {
  localStorage.clear(); // Elimina todos los datos del localStorage
  this.route.navigate(['/login']); // Redirección
}

viewProfile(){
  this.route.navigate(['/profile-index']);
}

get firstLetter(): string {
  return this.userName
    ? this.userName.charAt(0).toUpperCase()
    : '';
}

}
