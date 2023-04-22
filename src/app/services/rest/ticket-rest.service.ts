import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {INearestTour,ITour,ITourLocation} from "../../models/tours";


@Injectable({
  providedIn: 'root'
})
export class TicketRestService {

  constructor(private http:HttpClient) { }

  getTickets(): Observable<ITour[]>{
    return this.http.get<ITour[]>('https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/tours/')
  }

  getRestError(): Observable<ITour[]> {
    return this.http.get<ITour[]>('https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/tours/notFound');
  }

  getNearestTickets():Observable<INearestTour[]>{
    return this.http.get<INearestTour[]>(' https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/nearestTours/');
  }
  //локация
  getLocationList():Observable<ITourLocation[]>{
    return this.http.get<ITourLocation[]>('  https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/location/');
  }
}
