import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { ServicesComponent } from './services/services.component';
import { WorksComponent } from './works/works.component';
import { BlogsComponent } from './blogs/blogs.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'home', component: IndexPageComponent },
  {
    path: 'publications',
    loadChildren: () => import('./publications/publications.module').then(module => module.PublicationsModule)
  },
  { path: 'service', component: ServicesComponent },
  { path: 'work', component: WorksComponent },
  { path: 'blog', component: BlogsComponent },
  { path: 'about', component: AboutMeComponent },
  { path: 'contact', component: ContactMeComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
