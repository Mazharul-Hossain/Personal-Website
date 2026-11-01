import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResearchJourneyComponent } from "./research-journey.component";

describe("ResearchJourneyComponent", () => {
    let fixture: ComponentFixture<ResearchJourneyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResearchJourneyComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ResearchJourneyComponent);
        fixture.detectChanges();
    });

    it("renders employment roles with placeholders for unconfirmed details", () => {
        const element: HTMLElement = fixture.nativeElement;

        expect(element.querySelectorAll(".journey-entry").length).toBe(3);
        expect(element.querySelectorAll(".journey-entry.single-service").length).toBe(3);
        expect(element.textContent).toContain("National Cancer Institute");
        expect(element.textContent).toContain("University of Memphis");
        expect(element.textContent).toContain("Visiting Fellow");
        expect(element.textContent).toContain("Graduate Assistant");
        expect(element.textContent).toContain("Neuron23");
        expect(element.textContent).toContain("May 2022 – August 2022");
        expect(element.textContent).toContain("TODO:<ADD TRUE DETAILS>");
        expect(element.textContent).not.toContain("Ph.D. in Computer Science");
    });
});
