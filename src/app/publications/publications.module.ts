/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicationsComponent } from './publications.component';

const routes: Routes = [
    { path: '', component: PublicationsComponent }
];

@NgModule({
    declarations: [PublicationsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class PublicationsModule { }
