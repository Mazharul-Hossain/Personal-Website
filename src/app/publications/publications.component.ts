/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/publications/publications.component.html; Styles: src/app/publications/publications.component.css */
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-publications',
    templateUrl: './publications.component.html',
    styleUrl: './publications.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PublicationsComponent {

}
