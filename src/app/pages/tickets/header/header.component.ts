import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MenuItem} from "primeng/api";
import {IUsers} from "../../../models/users";
import {UserService} from "../../../services/user/user.service";
import {IMenuType} from "../../../models/menuType";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  items: MenuItem[];
  time: Date;
  private timerInterval: number;
  user: IUsers;

  @Input() menuType: IMenuType;

  private settingsActive:boolean = false
  constructor(private userService: UserService) {
  }

  ngOnChanges(ev: SimpleChanges): void {
    this.settingsActive = this.menuType?.type === "extended";
    this.items = this.initMenuItems();
    console.log("ev", ev)
  }
  ngOnInit(): void {
    this.items = [
      {
        label: 'Билеты',
        routerLink:['tickets-list']

      },
      {
        label: 'Выйти',
        routerLink:['/auth'],

      }
    ];

    this.timerInterval = setInterval(()=>{
      this.time = new Date();
    },1000);

    this.user = this.userService.getUser();

  }

  ngOnDestroy(): void {
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

  initMenuItems(): MenuItem[] {
    return [
      {
        label: 'Билеты',
        routerLink:['tickets-list']
      },
      {
        label: 'Настройки',
        routerLink:['/settings'],
        visible: this.settingsActive
      },
      {
        label: 'Выйти',
        routerLink:['/auth']
      },

    ];
  }
}
