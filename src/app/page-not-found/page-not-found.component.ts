/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/page-not-found/page-not-found.component.html; Styles: src/app/page-not-found/page-not-found.component.css */
// TODO<Bug>[BUG-04]: cancel delayed redirect on destruction; see docs/BUNDLE_OPTIMIZATION_PLAN.md.
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/window.token';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PageNotFoundComponent {
  constructor(
    private router: Router,
    @Inject(WindowRef) private windowRef: WindowRef
  ) { }

  ngOnInit() {
    const winRef = this.windowRef.nativeWindow();
    if (winRef) {
      // Redirect after a delay of 3 seconds
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
    }
  }
}
