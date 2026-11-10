/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/page-not-found/page-not-found.component.html; Styles: src/app/page-not-found/page-not-found.component.css */
import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/window.token';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  private redirectTimer?: ReturnType<typeof setTimeout>;
  constructor(
    private router: Router,
    @Inject(WindowRef) private windowRef: WindowRef
  ) { }

  ngOnInit(): void {
    const winRef = this.windowRef.nativeWindow();
    if (winRef) {
      // Keep the five-second delay advertised by the page.
      this.redirectTimer = setTimeout(() => {
        this.redirectTimer = undefined;
        this.router.navigate(['/']);
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimer);
    this.redirectTimer = undefined;
  }
}
