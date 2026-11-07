/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/home/research-overview/research-overview.component.html; Styles: src/app/home/research-overview/research-overview.component.css */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-research-overview',
    templateUrl: './research-overview.component.html',
    styleUrl: './research-overview.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ResearchOverviewComponent {}
