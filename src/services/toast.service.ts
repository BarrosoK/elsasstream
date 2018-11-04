import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class Message {
  content: string;
  style: string;
  dismissed = false;

  constructor(content, style?) {
    this.content = content;
    this.style = style || 'info';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private db: AngularFireDatabase) {
  }

  getMessages() {
      return this.db.list('messages', ref => ref.orderByKey().limitToLast(5)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => ({ key: a.key, ...a.payload.val() }))
        )
      );
  }
  sendMessage(content, style) {
    const message = new Message(content, style);
    this.db.list('messages').push(message);
  }

  dismissMessage(messageKey) {
    this.db.list(`messages`).remove(messageKey);
  }

}
