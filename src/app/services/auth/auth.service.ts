import {Injectable} from '@angular/core';
import {IUsers} from "../../models/users";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersStorage: IUsers[] = [];
  constructor() {
  }

  checkUsers(user: IUsers): boolean {
    const isUserExists = this.usersStorage.find((el) => el.login === user.login);

    const isUserLocalStorage = localStorage.getItem('User: '+`${user.login}`);

    let userInStore: IUsers = <IUsers>{};

    if(isUserLocalStorage){
      userInStore = JSON.parse(isUserLocalStorage);
    }

    if (isUserExists) {
      return isUserExists.psw === user.psw;

    } else if(userInStore){
      return userInStore.psw === user.psw;
    }
    return false;
  }

  setUsers(user: IUsers): void {
    const isUserExists = this.usersStorage.find((el) => el.login === user.login);
    if (!isUserExists && user?.login) {
      this.usersStorage.push(user)
    }
  }

  // idUser(user:IUsers): string{
  //   const idUserIndex = this.usersStorage.indexOf(user);
  //   return String(idUserIndex);
  // }

  isUserExist(user: IUsers): boolean {
    const isUserExists = this.usersStorage.find((el) => el.login === user.login);
    return !!isUserExists;
  }
}
