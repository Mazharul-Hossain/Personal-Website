/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/contact-me/contact-me.component.html; Styles: src/app/contact-me/contact-me.component.css */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-contact-me',
    templateUrl: './contact-me.component.html',
    styleUrls: ['./contact-me.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContactMeComponent {}
