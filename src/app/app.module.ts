import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavFooterComponent } from './nav-footer/nav-footer.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { ServicesComponent } from './services/services.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavFooterComponent,
    ContactMeComponent,
    ServicesComponent,
    IndexPageComponent,
    AboutMeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
