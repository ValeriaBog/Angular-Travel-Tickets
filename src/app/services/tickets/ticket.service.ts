import { Injectable } from '@angular/core';
import {TicketRestService} from "../rest/ticket-rest.service";
import {map, Observable, Subject} from "rxjs";
import {ICustomTicketData,INearestTour,ITour, ITourTypeSelect,ITourLocation} from "../../models/tours";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private ticketSubject = new Subject<ITourTypeSelect>()// 1 вариант доступа к Observable
  readonly ticketType$ = this.ticketSubject.asObservable();// 2 вариант доступа к Observable

  private ticketUpdateSubject = new Subject<ITour[]>();
  readonly ticketUpdateSubject$ = this.ticketUpdateSubject.asObservable();


  constructor(private ticketServiceRest: TicketRestService,
              private http: HttpClient) { }

  // getTickets():Observable<ITour[]>{
  //   return this.ticketServiceRest.getTickets().pipe(map(value=>{
  //     const singleTour = value.filter(e=>e.type==='single')
  //     return value.concat(singleTour)
  //   }));
  // }

  getTicketTypeObservable(): Observable<ITourTypeSelect> {
    return this.ticketSubject.asObservable();
  }

  updateTour(type:ITourTypeSelect): void {
    this.ticketSubject.next(type);
  }

  updateTicketList(data: ITour[]){
    this.ticketUpdateSubject.next(data)
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

  transformData (data: INearestTour[], regions: ITourLocation[]): ICustomTicketData[]{
    const newTicketData: ICustomTicketData[] = [];
    data.forEach((el) => {
      const newEl = <ICustomTicketData> {...el};
      newEl.region = <ICustomTicketData>regions.find((region) => el.locationId === region.id) || {};
      newTicketData.push(newEl);
    });
    return newTicketData;
  }

  getRandomNearestEvent(type: number): Observable<INearestTour>{
    return this.ticketServiceRest.getRandomNearestEvent(type);
  }

  sendTourData(data: any): Observable<any> {
    return this.ticketServiceRest.sendTourData(data);
  }

  getTickets(): Observable<ITour[]> {
     return this.http.get<ITour[]>('http://localhost:3000/tours/', {});
  }

  getTicketById(paramId: string): Observable<ITour> {
    return this.http.get<ITour>(`http://localhost:3000/tours/${paramId}`)
  }

createTour(body: any){
    return this.ticketServiceRest.createTour(body)
}
}


