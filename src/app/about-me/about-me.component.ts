import { Component, OnInit, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { AboutSkill } from './types';
import { aboutSkills } from './about-skills';
import { WindowRef } from '../shared/window.token';
// import counterUp from 'counterup2';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
  standalone: false
})
export class AboutMeComponent implements OnInit, AfterViewInit {
  private counterUp: any;
  about_skills: AboutSkill[] = [];

  constructor(
    private elementRef: ElementRef,
    @Inject(WindowRef) private windowRef: Window | undefined
  ) { }

  ngOnInit(): void {
    this.about_skills = aboutSkills;
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.windowRef) {
      // windowRef is available
      const lib = await import('counterup2');
      this.counterUp = lib.default; // or use lib directly

      // require("./node_modules/counterup2/dist/index.js");
      this.show_skills();
    }
  }

  show_skills(): void {
    for (const skill of this.about_skills) {
      const id: string = skill.id;

      // Progress Bar
      const progressLine = this.elementRef.nativeElement.querySelector(`#progress-line-${id}`);
      if (progressLine) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              progressLine.style.width = `${skill.performance}%`;
              observer.disconnect();
            }
          });
        });
        observer.observe(progressLine);
      }

      // Counter Up
      const counterElement = this.elementRef.nativeElement.querySelector(`#counter_${id}`);
      if (counterElement) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.counterUp(counterElement, {
                duration: 1000,
                delay: 32,
              });
              observer.disconnect();
            }
          });
        }, { threshold: 0.5 });
        observer.observe(counterElement);
      }
    }
  }
}
