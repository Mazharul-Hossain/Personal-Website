import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ResearchStudy {
    title: string;
    problem: string;
    method: string;
    evidence: string;
    figurePlaceholder: string;
    links: Array<{ label: string; href: string }>;
}

@Component({
    selector: 'app-selected-research',
    templateUrl: './selected-research.component.html',
    styleUrl: './selected-research.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SelectedResearchComponent {
    readonly studies: ResearchStudy[] = [
        {
            title: 'Robust Learning Across Sensors and Scenes',
            problem: 'Hyperspectral anomaly detectors can lose reliability when acquisition conditions or scene statistics change.',
            method: 'Greedy ensemble methods combine complementary anomaly detectors to support robust hyperspectral analysis.',
            evidence: 'TODO:<ADD TRUE DETAILS> — add an approved quantitative result and comparison context.',
            figurePlaceholder: 'TODO:<ADD TRUE DETAILS> — add an approved hyperspectral anomaly-detection research figure.',
            links: [
                { label: 'Paper', href: 'https://www.mdpi.com/2313-433X/10/6/131' }
            ]
        },
        {
            title: 'Physics-Informed Learning for Computational Imaging',
            problem: 'Microscopy reconstruction is an ill-posed inverse problem constrained by the measurement system.',
            method: 'USR and UPIGAN incorporate measurement-aware structure and deep priors into reconstruction.',
            evidence: 'TODO:<ADD TRUE DETAILS> — add an approved result without inventing a metric.',
            figurePlaceholder: 'TODO:<ADD TRUE DETAILS> — add an approved microscopy reconstruction figure.',
            links: [
                { label: 'USR paper', href: 'https://doi.org/10.1364/3D.2023.JTu4A.42' },
                { label: 'UPIGAN paper', href: 'https://doi.org/10.1117/12.2663268' }
            ]
        },
        {
            title: 'Adapting Vision Models to Changing Acquisition Conditions',
            problem: 'UAV hyperspectral segmentation must contend with domain and task shifts.',
            method: 'Task adaptation for semantic segmentation under changing agricultural-imaging conditions.',
            evidence: 'TODO:<ADD TRUE DETAILS> — add an approved result and dataset context.',
            figurePlaceholder: 'TODO:<ADD TRUE DETAILS> — add an approved UAV hyperspectral segmentation figure.',
            links: [
                { label: 'Paper', href: 'https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13475/1347507/10.1117/12.3053426.short' }
            ]
        }
    ];
}
