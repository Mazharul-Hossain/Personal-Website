import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-research-overview',
    templateUrl: './research-overview.component.html',
    styleUrl: './research-overview.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ResearchOverviewComponent {}
