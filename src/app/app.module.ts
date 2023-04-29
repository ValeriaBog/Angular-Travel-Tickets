import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthService} from "./services/auth/auth.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RestInterceptorsService} from "./services/interceptors/rest-interceptors.service";
import {ConfigService} from "./services/config/config.service";
import { StatisticComponent } from './pages/settings/statistic/statistic.component';
import {TableModule} from "primeng/table";


@NgModule({
  declarations: [
    AppComponent,



  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule
  ],
  providers: [ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService], multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: RestInterceptorsService, multi: true},],
  bootstrap: [AppComponent]
})

export class AppModule {}


  function initializeApp(config: ConfigService) {
    return () => config.loadPromise().then(() => {
      console.log('---CONFIG LOADED--', ConfigService.config)
    });
  }

