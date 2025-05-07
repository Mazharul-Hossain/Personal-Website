import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavFooterComponent } from './nav-footer/nav-footer.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { ServicesComponent } from './services/services.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { PublicationsComponent } from './publications/publications.component';
import { WorksComponent } from './works/works.component';
import { BlogsComponent } from './blogs/blogs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '/', component: IndexPageComponent },
  { path: '', component: IndexPageComponent },
  { path: 'home', component: IndexPageComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'service', component: ServicesComponent },
  { path: 'work', component: WorksComponent },
  { path: 'blog', component: BlogsComponent },
  { path: 'about', component: AboutMeComponent },
  { path: 'contact', component: ContactMeComponent },
  // Other routes
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavFooterComponent,
    ContactMeComponent,
    ServicesComponent,
    IndexPageComponent,
    AboutMeComponent,
    PublicationsComponent,
    WorksComponent,
    BlogsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
