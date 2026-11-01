import { Component } from '@angular/core';

@Component({
    selector: 'app-research-page',
    template: '<main><app-research-overview></app-research-overview><app-selected-research></app-selected-research></main>',
    styles: [':host { display: block; padding-top: 100px; }'],
    standalone: false
})
export class ResearchPageComponent {}

@Component({
    selector: 'app-experience-page',
    template: '<main><app-research-journey></app-research-journey></main>',
    styles: [':host { display: block; padding-top: 100px; }'],
    standalone: false
})
export class ExperiencePageComponent {}

@Component({
    selector: 'app-about-page',
    template: '<main><app-about-me></app-about-me></main>',
    styles: [':host { display: block; padding-top: 100px; }'],
    standalone: false
})
export class AboutPageComponent {}

@Component({
    selector: 'app-writing-page',
    template: '<main><app-blogs></app-blogs></main>',
    styles: [':host { display: block; padding-top: 100px; }'],
    standalone: false
})
export class WritingPageComponent {}

@Component({
    selector: 'app-contact-page',
    template: '<main><app-contact-me></app-contact-me></main>',
    styles: [':host { display: block; padding-top: 100px; }'],
    standalone: false
})
export class ContactPageComponent {}
