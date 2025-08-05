// gtag.service.ts
import { Injectable, Inject, DOCUMENT } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class GtagService {
    constructor(@Inject(DOCUMENT) private document: Document) { }

    addGtagScript(): void {
        // Google Tag Manager (gtag.js)
        const inlineScript = this.document.createElement('script');
        inlineScript.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CYRKWCGZNN');
        `;
        this.document.head.insertBefore(inlineScript, this.document.head.firstChild);

        const anotherInlineScript = this.document.createElement('script');
        anotherInlineScript.src = "https://www.googletagmanager.com/gtag/js?id=G-CYRKWCGZNN";
        anotherInlineScript.async = true; // makes script run asynchronously
        anotherInlineScript.type = "text/javascript"; // set the script type
        this.document.head.insertBefore(anotherInlineScript, this.document.head.firstChild);
    }
}