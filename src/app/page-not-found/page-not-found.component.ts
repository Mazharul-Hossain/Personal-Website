import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/window.token';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  standalone: false
})
export class PageNotFoundComponent {
  constructor(
    private router: Router,
    @Inject(WindowRef) private windowRef: any
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
