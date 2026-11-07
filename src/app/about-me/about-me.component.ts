/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/about-me/about-me.component.html; Styles: src/app/about-me/about-me.component.css */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-about-me',
    templateUrl: './about-me.component.html',
    styleUrls: ['./about-me.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AboutMeComponent {}
