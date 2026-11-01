import { ChangeDetectionStrategy, Component } from '@angular/core';

interface SelectedPublication {
    year: number;
    title: string;
    authors: string[];
    venue: string;
    url: string;
}

export function formatSelectedAuthors(authors: string[]): string {
    const owner = 'M. Hossain';
    const position = authors.indexOf(owner);
    if (position < 0) return authors.join(', ');
    if (position === 0) return authors.length > 1 ? `${owner} et al.` : owner;

    const preceding = position > 1 ? `${authors[0]}, …` : authors[0];
    const following = position < authors.length - 1 ? ' et al.' : '';
    return `${preceding}, ${owner}${following}`;
}

@Component({
    selector: 'app-selected-publications',
    templateUrl: './selected-publications.component.html',
    styleUrl: './selected-publications.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SelectedPublicationsComponent {
    readonly formatAuthors = formatSelectedAuthors;
    readonly publications: SelectedPublication[] = [
        {
            year: 2026,
            authors: ['M. Hossain', 'A. Robinson', 'C. Preza', 'L. Wang'],
            title: 'GMoE-AD: Generalized Hyperspectral Anomaly Detection via Mixture-of-Experts and Domain-Invariant Learning',
            venue: 'Sensors',
            url: 'https://doi.org/10.3390/s26175661'
        },
        {
            year: 2025,
            authors: ['M. Hossain', 'A. Robinson', 'L. Wang', 'C. Preza'],
            title: 'Improving Semantic Segmentation through Task Adaptation for UAV Hyperspectral Agricultural Imagery',
            venue: 'SPIE Autonomous Air and Ground Sensing Systems',
            url: 'https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13475/1347507/Improving-semantic-segmentation-through-task-adaptation-for-UAV-hyperspectral-agricultural/10.1117/12.3053426.short'
        },
        {
            year: 2024,
            authors: ['M. Hossain', 'M. Younis', 'A. Robinson', 'L. Wang', 'C. Preza'],
            title: 'Greedy Ensemble Hyperspectral Anomaly Detection',
            venue: 'Journal of Imaging',
            url: 'https://www.mdpi.com/2313-433X/10/6/131'
        },
        {
            year: 2023,
            authors: ['S. P. Dajkhosh', 'M. Hossain', 'C. Preza'],
            title: 'Structured Illumination Microscope Image Reconstruction Using Unrolled Physics-Informed Generative Adversarial Network (UPIGAN)',
            venue: 'SPIE Computational Imaging VII',
            url: 'https://doi.org/10.1117/12.2663268'
        },
        {
            year: 2022,
            authors: ['M. Hossain', 'T. Ma', 'T. Watson', 'B. Simmers', 'J. A. Khan', 'E. Jacobs', 'L. Wang'],
            title: 'Building Rich Interior Hazard Maps for Public Safety',
            venue: 'Springer Communications in Computer and Information Science',
            url: 'https://doi.org/10.1007/978-3-031-17098-0_9'
        }
    ];
}
