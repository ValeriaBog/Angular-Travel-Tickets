import { Injectable } from '@angular/core';
import {IUsers} from "../../models/users";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUsers|null;
  private token: string|null
  constructor() { }

  getUser(): IUsers | null{
    return this.user;
    // возвращается user
  };
  setUser(user: IUsers) {
    this.user = user;
    console.log(this.user)
    // записывается пользователь в this.user
  };

  setToken(token: string): void{
    this.token = token
    localStorage.setItem('token', token)
  }
  getToken(): string | null{
    return this.token || localStorage.getItem('token')
  }
  removeUser(){
    this.user = null
    this.token = null
  }
  setToStore(token: string) {
    window.localStorage.setItem('userToken', token);
  }

}
