/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/works/works.component.html; Styles: src/app/works/works.component.css */
import { Component, Inject, OnDestroy, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowRef } from '../shared/window.token';

@Component({
    selector: 'app-works',
    templateUrl: './works.component.html',
    styleUrl: './works.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WorksComponent implements OnDestroy {
    @ViewChild('cdkPopup') imagePopup!: TemplateRef<{ $implicit: string; imageName: string }>;
    private overlayRef?: OverlayRef;
    private focusTrap?: FocusTrap;
    private popupSubscriptions = new Subscription();
    private opener?: HTMLButtonElement;

    constructor(
        @Inject(Overlay) private overlay: Overlay, private viewContainerRef: ViewContainerRef,
        @Inject(WindowRef) private windowRef: WindowRef,
        private focusTrapFactory: FocusTrapFactory
    ) { }

    openImagePopup(imageSrc: string, imageName: string, opener: HTMLButtonElement): void {
        if (!this.windowRef.nativeWindow() || this.overlayRef) return;
        this.opener = opener;
        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-dark-backdrop',
            panelClass: 'image-popup-panel',
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically(),
            width: '60%',
            maxHeight: '90vh',
            scrollStrategy: this.overlay.scrollStrategies.block(),
        });
        this.overlayRef = overlayRef;
        this.popupSubscriptions = new Subscription();
        this.popupSubscriptions.add(overlayRef.backdropClick().subscribe(() => this.closeImagePopup()));
        this.popupSubscriptions.add(overlayRef.keydownEvents().subscribe(event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.closeImagePopup();
            }
        }));
        const portal = new TemplatePortal(this.imagePopup, this.viewContainerRef, {
            $implicit: imageSrc, imageName
        });
        overlayRef.attach(portal).detectChanges();
        this.focusTrap = this.focusTrapFactory.create(overlayRef.overlayElement);
        this.focusTrap.focusInitialElement();
    }

    closeImagePopup(): void {
        const opener = this.opener;
        this.disposePopup();
        if (opener?.isConnected) opener.focus();
    }

    ngOnDestroy(): void {
        // Route changes own subsequent focus; never move it back into the departing view.
        this.disposePopup();
    }

    private disposePopup(): void {
        this.popupSubscriptions.unsubscribe();
        this.focusTrap?.destroy();
        this.focusTrap = undefined;
        this.overlayRef?.dispose();
        this.overlayRef = undefined;
        this.opener = undefined;
    }
}
