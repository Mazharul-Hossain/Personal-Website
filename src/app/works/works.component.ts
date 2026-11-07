/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/works/works.component.html; Styles: src/app/works/works.component.css */
// TODO<Bug>[BUG-02]: add accessible popup controls/focus handling and teardown disposal with regression coverage; see docs/BUNDLE_OPTIMIZATION_PLAN.md.
import { Component, Inject, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';
import { WindowRef } from '../shared/window.token';

@Component({
    selector: 'app-works',
    templateUrl: './works.component.html',
    styleUrl: './works.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WorksComponent implements OnInit {
    @ViewChild('cdkPopup') imagePopup!: TemplateRef<any>;
    private overlayRef!: OverlayRef;

    constructor(
        @Inject(Overlay) private overlay: Overlay, private viewContainerRef: ViewContainerRef,
        @Inject(WindowRef) private windowRef: WindowRef
    ) { }

    ngOnInit(): void { }

    openImagePopup(imageSrc: string): void {
        const winRef = this.windowRef.nativeWindow();

        if (winRef && !this.overlayRef) {
            this.overlayRef = this.overlay.create({
                hasBackdrop: true,
                backdropClass: 'cdk-overlay-dark-backdrop',
                panelClass: 'image-popup-panel',
                positionStrategy: this.overlay.position()
                    .global()
                    .centerHorizontally()
                    .centerVertically(),
                width: '60%',
            });

            this.overlayRef.backdropClick().subscribe(() => this.closeImagePopup());
        }

        if (this.overlayRef) {
            const portal = new TemplatePortal(this.imagePopup, this.viewContainerRef, {
                $implicit: imageSrc
            });
            this.overlayRef.attach(portal);
        }
    }

    closeImagePopup(): void {
        if (this.overlayRef) {
            this.overlayRef.detach();
        }
    }
}
