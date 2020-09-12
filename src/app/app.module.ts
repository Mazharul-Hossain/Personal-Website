import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavFooterComponent } from './nav-footer/nav-footer.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { ServicesComponent } from './services/services.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { AboutMeComponent } from './about-me/about-me.component';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
