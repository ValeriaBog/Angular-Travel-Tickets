import { Injectable } from '@angular/core';
import {TicketRestService} from "../rest/ticket-rest.service";
import {Observable} from "rxjs";
import {ITour} from "../../models/tours";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private ticketServiceRest: TicketRestService) { }

  getTickets():Observable<ITour[]>{
    return this.ticketServiceRest.getTickets();
  }
}


