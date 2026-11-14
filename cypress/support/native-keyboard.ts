/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/STYLESHEET_REFINEMENT_PLAN.md
Consumers: cypress/e2e/research-popup.cy.ts */
// VERIFY-04: installed Cypress omits Enter text, so Chromium never emits keypress/button activation.
// Deliver the full trusted sequence; do not substitute element.click() for keyboard coverage.
export function pressNativeEnter(): void {
    if (!Cypress.isBrowser({ family: "chromium" })) {
        cy.press(Cypress.Keyboard.Keys.ENTER);
        return;
    }
    cy.window().then(win => { win.focus(); });
    cy.then(() => Cypress.automation("remote:debugger:protocol", {
        command: "Input.dispatchKeyEvent",
        params: {
            type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13,
            text: "\r", unmodifiedText: "\r"
        }
    }));
    cy.then(() => Cypress.automation("remote:debugger:protocol", {
        command: "Input.dispatchKeyEvent",
        params: { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 }
    }));
}
