import { Component } from '@angular/core';
import {ObservableExampleService} from "./services/testing/observable.service";
import {ConfigService} from "./services/config/config.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ticketSales2022';
  prop: string;
  constructor(private testing: ObservableExampleService, private configService: ConfigService) {
    testing.initObservable()
  }

  ngOnInit(){

    this.configService.configLoad()

    const myObservable = this.testing.getObservable();

    myObservable.subscribe((data)=>{
      console.log('first data Observable', data)
    })
    myObservable.subscribe((data)=>{
      console.log('second data Observable', data)
    })



    const mySubject= this.testing.getSubject()

    mySubject.subscribe((data)=>{
      console.log('first data subject', data)
    })
    mySubject.subscribe((data)=>{
      console.log('second data subject', data)
    })

    mySubject.next('subject value')
    mySubject.next('subject value')


    const myBehavior = this.testing.getBehaviorSubject()
    myBehavior.subscribe((data)=>{
      console.log('first data Behavior', data)
    })

    myBehavior.next('new data from behaviorSubject')
    myBehavior.next('new data from behaviorSubject')
  }





}











