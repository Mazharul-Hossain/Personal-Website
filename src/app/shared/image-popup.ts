/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-design/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Consumer and template: src/app/home/selected-research/selected-research.component.ts; src/app/home/selected-research/selected-research.component.html */
import { Injector, TemplateRef, ViewContainerRef } from '@angular/core';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

export interface ImagePreview {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
}

/** Imported on demand; the owning view must dispose this controller on destruction. */
export class ImagePopup {
    private readonly overlayRef: OverlayRef;
    private readonly focusTrap: FocusTrap;
    private readonly subscriptions = new Subscription();

    constructor(
        injector: Injector,
        template: TemplateRef<{ $implicit: ImagePreview }>,
        view: ViewContainerRef,
        image: ImagePreview,
        private readonly opener: HTMLButtonElement,
        close: () => void
    ) {
        const overlay = injector.get(Overlay);
        this.overlayRef = overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-dark-backdrop',
            positionStrategy: overlay.position().global().centerHorizontally().centerVertically(),
            width: 'calc(100vw - 32px)',
            maxWidth: '1200px',
            maxHeight: '90vh',
            scrollStrategy: overlay.scrollStrategies.block()
        });
        this.subscriptions.add(this.overlayRef.backdropClick().subscribe(close));
        this.subscriptions.add(this.overlayRef.keydownEvents().subscribe(event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
            }
        }));
        this.overlayRef.attach(new TemplatePortal(template, view, { $implicit: image })).detectChanges();
        this.focusTrap = injector.get(FocusTrapFactory).create(this.overlayRef.overlayElement);
        this.focusTrap.focusInitialElement();
    }

    dispose(restoreFocus = false): void {
        this.subscriptions.unsubscribe();
        this.focusTrap.destroy();
        this.overlayRef.dispose();
        if (restoreFocus && this.opener.isConnected) this.opener.focus();
    }
}
