import {AfterViewInit, Component, OnInit} from '@angular/core';
import {INearestTour,ITour,ITourLocation} from "../../../models/tours";
import {ActivatedRoute} from "@angular/router";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {IUsers} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {forkJoin} from "rxjs";
import {TicketService} from "../../../services/tickets/ticket.service";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit {
  ticket: ITour | undefined;
  user: IUsers|null
  userForm: FormGroup
  nearestTours: INearestTour[];
  tourLocation: ITourLocation[]

  constructor(private route: ActivatedRoute,
              private ticketStorage: TicketsStorageService,
              private userService: UserService,
              private ticketService: TicketService) {
  }

  ngOnInit(): void {

    this.user = this.userService.getUser()

this.userForm = new FormGroup({
  firstName: new FormControl('aa',{validators: Validators.required}),
  lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
  cardNumber: new FormControl(),
  birthDay: new FormControl(),
  age: new FormControl(),
  citizen: new FormControl(),

})


    const routeIdParam = this.route.snapshot.paramMap.get('id'); //вернет значение (индетификатор), кот передан ticket-list.component.ts (navigate)
    const queryIdParam = this.route.snapshot.queryParamMap.get('id');

    const paramValueId = routeIdParam || queryIdParam;
    if (paramValueId) {
      const ticketStorage = this.ticketStorage.getStorage();
      this.ticket = ticketStorage.find((el) => el.id === paramValueId);
      console.log('this.ticket', this.ticket)
    }

    forkJoin([this.ticketService.getNearestTours(), this.ticketService.getToursLocation()]).subscribe((data) =>{
      console.log('data', data)
      this.nearestTours = data[0];
      this.tourLocation = data[1];
    })

  }

  ngAfterViewInit(): void{
    this.userForm.controls['cardNumber'].setValue(this.user?.cardNumber)
  }

  selectDate(e: Event): void{

  }

  onSubmit(): void{

  }

}
