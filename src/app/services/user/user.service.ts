import { Injectable } from '@angular/core';
import {IUsers} from "../../models/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUsers;
  constructor() { }

  getUser(): IUsers {
    return this.user;
    // возвращается user
  };
  setUser(user: IUsers) {
    this.user = user;
    console.log(this.user)
    // записывается пользователь в this.user
  };
}
