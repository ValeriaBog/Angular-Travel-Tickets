import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ICustomTicketData, INearestTour, ITour, ITourLocation} from "../../../models/tours";
import {ActivatedRoute} from "@angular/router";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {IUsers} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {forkJoin, fromEvent, Subscription} from "rxjs";
import {TicketService} from "../../../services/tickets/ticket.service";
import {IOrder} from "../../../models/order";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit {
  ticket: ITour | undefined;
  user: IUsers | null
  userForm: FormGroup
  nearestTours: ICustomTicketData[];
  tourLocation: ITourLocation[]
  ticketSearchValue: string;
  searchTicketSub: Subscription;
  ticketRestSub: Subscription;
  searchTypes = [1, 2, 3]

  @ViewChild('ticketSearch') ticketSearch: ElementRef;

  constructor(private route: ActivatedRoute,
              private ticketStorage: TicketsStorageService,
              private userService: UserService,
              private ticketService: TicketService) {
  }

  ngOnInit(): void {

    this.user = this.userService.getUser()

    this.userForm = new FormGroup({
      firstName: new FormControl('', {validators: Validators.required}),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      cardNumber: new FormControl(this.user?.cardNumber),
      birthDay: new FormControl(''),
      age: new FormControl(),
      citizen: new FormControl(''),

    })


    const routeIdParam = this.route.snapshot.paramMap.get('id'); //вернет значение (индетификатор), кот передан ticket-list.component.ts (navigate)
    const queryIdParam = this.route.snapshot.queryParamMap.get('_id');

    const paramValueId = routeIdParam || queryIdParam;
    console.log('paramValueId', paramValueId)
    if (paramValueId) {
      this.ticketService.getTicketById(paramValueId).subscribe((data) => {
        this.ticket = data;
      });

      // const ticketStorage = this.ticketStorage.getStorage();
      // if(Array.isArray(ticketStorage)){
      //   this.ticket = ticketStorage.find((el) => el.id === paramValueId);
      // }
      // console.log('this.ticket', this.ticket)
    }

    forkJoin([this.ticketService.getNearestTours(),
      this.ticketService.getToursLocation()]).subscribe((data) => {
      console.log('data', data)
      this.tourLocation = data[1];
      this.nearestTours = this.ticketService.transformData(data[0], data[1]);

    })

  }

  ngAfterViewInit(): void {
    this.userForm.controls['cardNumber'].setValue(this.user?.cardNumber)

    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup')
    this.searchTicketSub = fromEventObserver.subscribe((ev: any) => {
      this.initSearchTour()
    })
  }

  ngOnDestroy(): void {
    this.searchTicketSub.unsubscribe();
  }

  initSearchTour(): void {
    //определяем значение, которое будет в рандомном порядке (0.1, 0.2, 0.3)
    const type = Math.floor(Math.random() * this.searchTypes.length);
    //в случае долгого запроса могли от него отписаться
    if (this.ticketRestSub && !this.searchTicketSub.closed) {
      this.ticketRestSub.unsubscribe();
    }
    //записываем результат запроса на сервер
    this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data) => {
      this.nearestTours = this.ticketService.transformData([data], this.tourLocation)
    })
  }

  selectDate(e: Event): void {

  }

  onSubmit(): void {

  }

  initTour(): void {
    //получаем наши данные
    const userData = this.userForm.getRawValue();
    //информация о туре + личная информация
    const postData = {...this.ticket, ...userData};
    console.log('postData', postData)

    const userId = this.userService.getUser()?.id || null;

    const postObj: IOrder = {
      age: postData.age,
      birthday: postData.birthday,
      cardNumber: postData.cardNumber,
      lastName: postData.lastName,
      tourId: postData._id,
      userId: userId,
    }

    this.ticketService.sendTourData(postObj).subscribe()

  }

}
