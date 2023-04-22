import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TicketService} from "../../../services/tickets/ticket.service";
import {ITour, ITourTypeSelect} from "../../../models/tours";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {Router} from "@angular/router";
import {BlocksStyleDirective} from "../../../directive/blocks-style.directive";
import {debounceTime, fromEvent, Subscription} from "rxjs";

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, AfterViewInit {
  tickets: ITour[];
  nameTour: string;
  x =false

  @ViewChild('tourWrap', {read: BlocksStyleDirective}) blockDirective: BlocksStyleDirective; // к директиве,  можно записать так @ViewChild(BlocksStyleDirective) blockDirective: BlocksStyleDirective;
  @ViewChild('tourWrap') tourWrap: ElementRef; // к элементу
  @ViewChild('ticketSearch') ticketSearch:ElementRef;
  searchTicketSub: Subscription
  ticketSearchValue: string
  tourUnsubscriber: Subscription;
  ticketsCopy: ITour[];



  constructor(private ticketService: TicketService,
              private ticketStorage: TicketsStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        this.ticketsCopy = [...this.tickets];
        this.ticketStorage.setStorage(data);

      })

    this.tourUnsubscriber = this.ticketService.ticketType$.subscribe((data:ITourTypeSelect) => {  console.log('data', data)

      setTimeout(() => {

        this.blockDirective.updateItems();

        this.blockDirective.initStyle(0);  // сбрасываем индекс на 0 элемент
      });

      let ticketType: string;
      switch (data.value) {
        case "single":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "single");
          break;
        case "multi":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "multi");
          break;
        case "all":
          this.tickets = [...this.ticketsCopy];
          break;

      }

      if (data.date) {
        const dateWithoutTime = new Date(data.date).toISOString().split('T');
        const dateValue = dateWithoutTime[0]
        console.log('dateValue',dateValue)
        this.tickets = this.ticketsCopy.filter((el) => el.date === dateValue);
      }
    });
  }

  ngAfterViewInit() {
const fromEventOberver = fromEvent(this.ticketSearch.nativeElement, 'keyup')
    this.searchTicketSub = fromEventOberver.pipe(
      debounceTime(200)).subscribe((ev)=>{
        if(this.ticketSearchValue){
          const str = this.ticketSearchValue[0].toUpperCase() + this.ticketSearchValue.slice(1).toLowerCase()
          this.tickets = this.ticketsCopy.filter((el)=> el.name.includes(str))
        }else{
          this.tickets = [...this.ticketsCopy]
        }
      }
    )
  }

  ngOnDestroy() {
    this.tourUnsubscriber.unsubscribe();
    this.searchTicketSub.unsubscribe()
  }

  search(ev:Event){
   const findNameTour =  this.tickets.find((e)=>{
     return e.name == this.nameTour
    })
    if(findNameTour){
      this.goToTicketInfoPage(findNameTour)
    }


  }

  goToTicketInfoPage(item: ITour) {
    this.router.navigate([`/tickets/ticket/${item.id}`])
  }

  directiveRenderComplete(ev: boolean){
    this.x =true;
    const el: HTMLElement = this.tourWrap.nativeElement;
    el.setAttribute('style', 'background-color: #e9efec')

    this.blockDirective.initStyle(0)
  }
}



