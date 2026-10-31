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
            stage: "Current",
            organization: "National Cancer Institute, National Institutes of Health",
            role: "Visiting Fellow",
            description: "Computational cryo-electron microscopy and scientific-computing methods for imaging."
        },
        {
            stage: "Ph.D. research",
            organization: "University of Memphis",
            role: "Ph.D. in Computer Science",
            description: "Research spanning hyperspectral image analysis, robust learning, and physics-guided microscopy reconstruction."
        }
    ];
}
