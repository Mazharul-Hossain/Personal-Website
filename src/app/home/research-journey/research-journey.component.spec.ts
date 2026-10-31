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

    it("renders the confirmed research trajectory", () => {
        const element: HTMLElement = fixture.nativeElement;

        expect(element.querySelectorAll(".journey-entry").length).toBe(2);
        expect(element.querySelectorAll(".journey-entry.single-service").length).toBe(2);
        expect(element.textContent).toContain("National Cancer Institute");
        expect(element.textContent).toContain("University of Memphis");
    });
});
