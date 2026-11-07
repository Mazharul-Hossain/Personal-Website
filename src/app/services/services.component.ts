/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/services/services.component.html; Styles: src/app/services/services.component.css */
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ServicesComponent {
}
