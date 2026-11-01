import { ChangeDetectionStrategy, Component } from "@angular/core";

interface JourneyEntry {
    stage: string;
    organization: string;
    role: string;
    description: string;
}

@Component({
    selector: "app-research-journey",
    templateUrl: "./research-journey.component.html",
    styleUrl: "./research-journey.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ResearchJourneyComponent {
    readonly entries: JourneyEntry[] = [
        {
            stage: "Current — TODO:<ADD TRUE DETAILS> — start date",
            organization: "National Cancer Institute, National Institutes of Health",
            role: "Visiting Fellow",
            description: "My work focuses on computational cryo-electron microscopy. TODO:<ADD TRUE DETAILS> — add the official unit, day-to-day responsibilities, and contributions that may be described publicly."
        },
        {
            stage: "TODO:<ADD TRUE DETAILS> — employment dates",
            organization: "University of Memphis",
            role: "Graduate Assistant",
            description: "TODO:<ADD TRUE DETAILS> — confirm the official appointment title and department, and describe research, teaching, or other responsibilities actually held."
        },
        {
            stage: "May 2022 – August 2022",
            organization: "Neuron23",
            role: "Intern",
            description: "TODO:<ADD TRUE DETAILS> — add the official internship title, team, responsibilities, and contributions."
        }
    ];
}
