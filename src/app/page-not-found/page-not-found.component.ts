import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  standalone: false
})
export class PageNotFoundComponent {
  constructor(private router: Router) { }

  ngOnInit() {
    // Redirect after a delay of 3 seconds
    setTimeout(() => {
      this.router.navigate(['/']); 
    }, 5000);
  }
}
