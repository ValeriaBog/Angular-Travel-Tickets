import { Injectable } from '@angular/core';
import {TicketRestService} from "../rest/ticket-rest.service";
import {map, Observable, Subject} from "rxjs";
import {INearestTour,ITour, ITourTypeSelect,ITourLocation} from "../../models/tours";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private ticketSubject = new Subject<ITourTypeSelect>()// 1 вариант доступа к Observable
  readonly ticketType$ = this.ticketSubject.asObservable();// 2 вариант доступа к Observable


  constructor(private ticketServiceRest: TicketRestService) { }

  getTickets():Observable<ITour[]>{
    return this.ticketServiceRest.getTickets().pipe(map(value=>{
      const singleTour = value.filter(e=>e.type==='single')
      return value.concat(singleTour)
    }));
  }

  getTicketTypeObservable(): Observable<ITourTypeSelect> {
    return this.ticketSubject.asObservable();
  }

  updateTour(type:ITourTypeSelect): void {
    this.ticketSubject.next(type);
  }

  getError(): Observable<any>{
    return this.ticketServiceRest.getRestError()
  }

  getNearestTours(): Observable<INearestTour[]>{
    return this.ticketServiceRest.getNearestTickets()
  }

  getToursLocation(): Observable<ITourLocation[]>{
    return this.ticketServiceRest.getLocationList()
  }
}


