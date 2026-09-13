import { ChangeDetectionStrategy, Component } from '@angular/core';

interface SelectedPublication {
    year: number;
    title: string;
    venue: string;
    url: string;
}

@Component({
    selector: 'app-selected-publications',
    templateUrl: './selected-publications.component.html',
    styleUrl: './selected-publications.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SelectedPublicationsComponent {
    readonly publications: SelectedPublication[] = [
        {
            year: 2026,
            title: 'GMoE-AD: Generalized Hyperspectral Anomaly Detection via Mixture-of-Experts and Domain-Invariant Learning',
            venue: 'Sensors',
            url: 'https://doi.org/10.3390/s26175661'
        },
        {
            year: 2025,
            title: 'Improving Semantic Segmentation through Task Adaptation for UAV Hyperspectral Agricultural Imagery',
            venue: 'SPIE Autonomous Air and Ground Sensing Systems',
            url: 'https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13475/1347507/Improving-semantic-segmentation-through-task-adaptation-for-UAV-hyperspectral-agricultural/10.1117/12.3053426.short'
        },
        {
            year: 2024,
            title: 'Greedy Ensemble Hyperspectral Anomaly Detection',
            venue: 'Journal of Imaging',
            url: 'https://www.mdpi.com/2313-433X/10/6/131'
        },
        {
            year: 2023,
            title: 'Structured Illumination Microscope Image Reconstruction Using Unrolled Physics-Informed Generative Adversarial Network (UPIGAN)',
            venue: 'SPIE Computational Imaging VII',
            url: 'https://doi.org/10.1117/12.2663268'
        },
        {
            year: 2022,
            title: 'Building Rich Interior Hazard Maps for Public Safety',
            venue: 'Springer Communications in Computer and Information Science',
            url: 'https://doi.org/10.1007/978-3-031-17098-0_9'
        }
    ];
}
