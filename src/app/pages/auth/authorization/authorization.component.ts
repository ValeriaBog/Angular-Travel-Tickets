import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {IUsers} from "../../../models/users";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})

export class AuthorizationComponent implements OnInit, OnDestroy {
  loginText = 'Логин';
  pswText = 'Пароль';
  id: string
  login: string;
  psw: string;
  cardNumber: string;
  authTextButton: string;
  selectedValue: boolean;

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.authTextButton = "Авторизоваться";
  }

  ngOnDestroy() {
    console.log('Destroy')
  }

  vipStatusSelected(): void {
  }

  onAuth(ev: Event): void {
    const authUser: IUsers = {
      id: this.id,
      psw: this.psw,
      login: this.login,
      cardNumber: this.cardNumber
    }

    this.http.post<{ access_token: string, id: string }>('http://localhost:3000/users/' + authUser.login, authUser).subscribe((data) => {
      authUser.id = data.id
      this.userService.setUser(authUser);
      const token: string = data.access_token;
      this.userService.setToken(token);
      this.userService.setToStore(token);

      this.router.navigate(['tickets/tickets-list']);
    }, () => {

      this.messageService.add({severity: 'warn', summary: "Ошибка"});
    });

    // if (!this.authService.checkUsers(authUser)) {
    //   this.messageService.add({severity: 'error', summary: 'Введены неверные логин или пароль'});
    // } else {
    //   this.userService.setUser(authUser);
    //   this.router.navigate(['tickets/tickets-list'])
    //   this.userService.setToken('user-private-token')
    // }
  }
}

