/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Implementation: src/app/works/works.component.ts */
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRef } from '../shared/window.token';
import { WorksComponent } from './works.component';

// Removing named native controls, dismissal, or owned teardown must break these checks.
describe('WorksComponent', () => {
  let fixture: ComponentFixture<WorksComponent>;
  let container: HTMLElement;
  let overlayContainer: OverlayContainer;

  const openers = () => Array.from(fixture.nativeElement.querySelectorAll('button.image-popup')) as HTMLButtonElement[];
  const open = (index = 0) => {
    const opener = openers()[index];
    opener.click();
    fixture.detectChanges();
    return opener;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [WorksComponent] }).compileComponents();
    fixture = TestBed.createComponent(WorksComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    container = overlayContainer.getContainerElement();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    overlayContainer.ngOnDestroy();
  });

  it('provides named native image buttons for both projects', () => {
    expect(openers().length).toBe(2);
    for (const opener of openers()) {
      expect(opener.type).toBe('button');
      expect(opener.getAttribute('aria-label')).toContain('Preview');
      expect(opener.tabIndex).toBe(0);
    }
  });

  it('opens a named modal and places focus on its close control', () => {
    open();
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-label')).toContain('Map901');
    expect(document.activeElement).toBe(dialog?.querySelector('button') ?? null);
  });

  it('closes and returns focus to the actual second opener', () => {
    const opener = open(1);
    container.querySelector<HTMLButtonElement>('.popup-close')!.click();
    expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('dismisses with Escape and returns focus', () => {
    const opener = open();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(container.querySelector('.popup-image')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('dismisses from the backdrop and can reopen without stale handlers', () => {
    const opener = open();
    container.querySelector<HTMLElement>('.cdk-overlay-backdrop')!.click();
    expect(container.querySelector('.popup-image')).toBeNull();
    expect(document.activeElement).toBe(opener);
    open(1);
    expect(container.querySelector('.popup-image')?.getAttribute('src')).toBe('assets/images/work/w-2.png');
    expect(container.querySelectorAll('.cdk-overlay-pane').length).toBe(1);
  });

  it('contains focus through both CDK tab boundary sentinels', () => {
    open();
    const close = container.querySelector('.popup-close');
    const sentinels = Array.from(container.querySelectorAll<HTMLElement>('.cdk-focus-trap-anchor'));
    expect(sentinels.length).toBe(2);
    for (const sentinel of sentinels) {
      sentinel.focus();
      expect(document.activeElement).toBe(close);
    }
  });

  it('disposes overlay and focus anchors on destruction without restoring opener focus', () => {
    const opener = open();
    const focus = spyOn(opener, 'focus');
    fixture.destroy();
    expect(container.querySelector('.cdk-overlay-pane, .cdk-overlay-backdrop, .cdk-focus-trap-anchor')).toBeNull();
    expect(focus).not.toHaveBeenCalled();
  });

  it('does not create a browser overlay when the window is unavailable', () => {
    spyOn(TestBed.inject(WindowRef), 'nativeWindow').and.returnValue(undefined);
    open();
    expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
  });
});
