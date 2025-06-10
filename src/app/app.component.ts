import { Component, OnInit, Inject } from '@angular/core';
import { GtagService } from './gtag/gtag.service';
import { WindowRef } from './shared/window.token';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
    title = 'my-app';

    constructor(private gtagService: GtagService,
        @Inject(WindowRef) private windowRef: WindowRef | undefined) { }

    ngOnInit(): void {
        if (this.windowRef.nativeWindow()) {
            this.gtagService.addGtagScript();
        }
    }
}
