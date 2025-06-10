import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class WindowRef {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    nativeWindow(): Window | undefined {
        return isPlatformBrowser(this.platformId) ? window : undefined;
    }
}

// export const WINDOW = new InjectionToken<Window | undefined>('WindowToken', {
//     factory: () => (typeof window !== 'undefined' ? window : undefined)
// });
