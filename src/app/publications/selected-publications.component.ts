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
            title: 'USR: Unrolled Super-Resolution with Deep Priors for Structured Illumination Microscopy',
            venue: 'Optica Imaging Systems and Applications',
            url: 'https://doi.org/10.1364/3D.2023.JTu4A.42'
        },
        {
            year: 2023,
            title: 'Structured Illumination Microscope Image Reconstruction Using UPIGAN',
            venue: 'SPIE Computational Imaging VII',
            url: 'https://doi.org/10.1117/12.2663268'
        },
        {
            year: 2023,
            title: 'Hyperspectral Unmixing-Based Anomaly Detection',
            venue: 'SPIE Computational Imaging VII',
            url: 'https://doi.org/10.1117/12.2664706'
        },
        {
            year: 2022,
            title: 'Building Rich Interior Hazard Maps for Public Safety',
            venue: 'Communications in Computer and Information Science',
            url: 'https://link.springer.com/chapter/10.1007/978-3-031-17098-0_9'
        }
    ];
}
