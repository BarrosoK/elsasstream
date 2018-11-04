import { Component, OnInit } from '@angular/core';
import {ToastService} from '../../services/toast.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
@Component({
  selector: 'app-toast-messages',
  templateUrl: './toast-messages.component.html',
  styleUrls: ['./toast-messages.component.scss']
})
export class ToastMessagesComponent implements OnInit {

  messages;

  constructor(private toast: ToastService) { }

  ngOnInit() {
    this.messages = this.toast.getMessages();
  }

  dismiss(itemKey) {
    this.toast.dismissMessage(itemKey);
  }
}
