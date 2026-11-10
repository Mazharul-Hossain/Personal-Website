/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Route: src/app/app-routing.module.ts; Component: src/app/works/works.component.ts */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksComponent } from './works.component';

const routes: Routes = [
    { path: '', component: WorksComponent }
];

@NgModule({
    declarations: [WorksComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class WorksModule { }
