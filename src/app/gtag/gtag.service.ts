// gtag.service.ts
import { Injectable, Inject, DOCUMENT } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class GtagService {
    constructor(@Inject(DOCUMENT) private document: Document) { }

    addGtagScript(): void {
        // Google Tag Manager
        const inlineScript = this.document.createElement('script');
        inlineScript.text = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WNQ3WGZ');
        `;
        this.document.head.insertBefore(inlineScript, this.document.head.firstChild);

        // Google Tag Manager (noscript)
        const anotherInlineScript = this.document.createElement('noscript');
        inlineScript.text = `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WNQ3WGZ"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
        `;
        this.document.body.insertBefore(anotherInlineScript, this.document.body.firstChild);
    }
}