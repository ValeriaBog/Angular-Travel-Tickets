import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {AuthService} from "../../../services/auth/auth.service";
import {IUsers} from "../../../models/users";
import {ConfigService} from "../../../services/config/config.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ServerError} from "../../../models/error";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
   id: string;
  login: string;
  psw: string;
  pswRepeat: string;
  email: string;
  cardNumber: string;
  selectedValue: boolean;
  showCardNumber: boolean;
  saveUserInStore: boolean

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.showCardNumber = ConfigService.config.useUserCard
  }

  registration(ev: Event): void | boolean {
    if (this.psw !== this.pswRepeat) {
      this.messageService.add({severity: 'error', summary: 'Пароли не совпадают'});
      return false
    }

    const userObj: IUsers = {
      id: this.id,
      psw: this.psw,
      login: this.login,
      cardNumber: this.cardNumber,
      email: this.email
    }

    this.http.post<IUsers>('http://localhost:3000/users', userObj).subscribe((data)=>{
      if (this.saveUserInStore) {
        const objUserJsonStr = JSON.stringify(userObj);
        window.localStorage.setItem('user_'+userObj.login, objUserJsonStr);
      }
      this.messageService.add({severity:'success', summary:'Регистрация прошла успешно'});
    },(err: HttpErrorResponse)=> {
      const serverError = <ServerError>err.error
        this.messageService.add({severity:'warn', summary:serverError.errorText});
      })



    // if (!this.authService.isUserExist(userObj) && this.selectedValue) {
    //
    //   this.authService.setUsers(userObj);
    //
    //  //const idUserInd = this.authService.idUser(userObj);
    //
    //   this.messageService.add({severity: 'success', summary: 'Регистрация прошла успешно'});
    //
    //   const jsObj = JSON.stringify(userObj);
    //
    //   localStorage.setItem('User: '+`${userObj.login}`, jsObj); // ключ - id
    //
    //
    // } else if (!this.authService.isUserExist(userObj) && !this.selectedValue) {
    //
    //   this.authService.setUsers(userObj);
    //
    //   this.messageService.add({severity: 'success', summary: 'Регистрация прошла успешно'});
    //
    // } else {
    //   this.messageService.add({severity: 'warn', summary: 'Пользователь уже зарегистрирован'});
    // }
  }

  saveUserInLS(): void {
  }

}
