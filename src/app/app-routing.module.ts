/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { ServicesComponent } from './services/services.component';
import { AboutPageComponent, ContactPageComponent, ExperiencePageComponent, ResearchPageComponent, WritingPageComponent } from './home/standalone-pages.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'home', component: IndexPageComponent },
  { path: 'research', component: ResearchPageComponent },
  { path: 'experience', component: ExperiencePageComponent },
  {
    path: 'publications',
    loadChildren: () => import('./publications/publications.module').then(module => module.PublicationsModule)
  },
  { path: 'service', component: ServicesComponent },
  {
    path: 'work',
    loadChildren: () => import('./works/works.module').then(module => module.WorksModule)
  },
  { path: 'blog', component: WritingPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'contact', component: ContactPageComponent },
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
