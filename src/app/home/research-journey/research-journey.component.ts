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
            stage: "June 2026 – Present",
            organization: "National Cancer Institute, National Institutes of Health",
            role: "Visiting Fellow",
            description: "I develop and validate computational methods and software for cryo-electron microscopy."
        },
        {
            stage: "August 2018 – May 2026",
            organization: "University of Memphis",
            role: "Graduate Assistant",
            description: "I researched hyperspectral imaging, LiDAR indoor mapping, microscopy reconstruction, and responsible AI."
        },
        {
            stage: "May 2022 – August 2022",
            organization: "Neuron23",
            role: "Data Scientist Intern",
            description: "I developed compound-modeling software and interpretable molecular-property models."
        }
    ];
}
