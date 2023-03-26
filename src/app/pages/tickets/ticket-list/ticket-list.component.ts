import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TicketService} from "../../../services/tickets/ticket.service";
import {ITour} from "../../../models/tours";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {Router} from "@angular/router";
import {BlocksStyleDirective} from "../../../directive/blocks-style.directive";

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, AfterViewInit {
  tickets: ITour[];
  @ViewChild('tourWrap', {read: BlocksStyleDirective}) blockDirective: BlocksStyleDirective; // к директиве,  можно записать так @ViewChild(BlocksStyleDirective) blockDirective: BlocksStyleDirective;
  @ViewChild('tourWrap') tourWrap: ElementRef; // к элементу

  constructor(private ticketService: TicketService,
              private ticketStorage: TicketsStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        this.ticketStorage.setStorage(data);

      })
  }

  ngAfterViewInit() {

  }

  goToTicketInfoPage(item: ITour) {
    this.router.navigate([`/tickets/ticket/${item.id}`])
  }

  directiveRenderComplete(ev: boolean){
    const el: HTMLElement = this.tourWrap.nativeElement;
    el.setAttribute('style', 'background-color: #e9efec')

    this.blockDirective.initStyle(0)
  }
}
