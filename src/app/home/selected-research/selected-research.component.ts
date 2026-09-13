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
            title: 'Hyperspectral Anomaly Detection Across Sensors',
            problem: 'Rare anomalies and changing backgrounds make it hard for any single detector to work reliably across hyperspectral scenes and sensors.',
            method: 'HUE-AD combined spectral-abundance estimates with three anomaly detectors by equal vote. GE-AD replaced fixed selection and weights with a learned ensemble; a later study compared supervised and unsupervised variants. GMoE-AD added neural experts and domain-adversarial training for cross-domain detection.',
            evidence: 'GE-AD averaged 86.5% F1-macro on eight public images. GMoE-AD averaged 0.943 ROC-AUC across 22 images from seven datasets with multi-domain training and 0.910 in leave-one-dataset-out evaluation.',
            figurePlaceholder: 'GMoE-AD graphical abstract: assets/images/work/gmoe-ad-graphical-abstract.png',
            // GE-AD graphical abstract: assets/images/work/ge-ad-graphical-abstract.png
            links: [
                { label: 'GMoE-AD paper', href: 'https://www.mdpi.com/1424-8220/26/17/5661' },
                { label: 'GE-AD paper', href: 'https://www.mdpi.com/2313-433X/10/6/131' },
                { label: 'Ensemble comparison', href: 'https://arxiv.org/abs/2408.07114' },
                { label: 'HUE-AD paper', href: 'https://doi.org/10.1117/12.2664706' }
            ]
        },
        {
            title: 'Physics-Informed Reconstruction for 3D Microscopy',
            problem: 'Reconstructing 3D structured-illumination microscopy images from noisy measurements requires both fine detail and fidelity to how the microscope forms an image.',
            method: 'USR combines a learned image prior with repeated corrections based on the microscope point spread function. UPIGAN extends this physics-informed, unrolled approach with adversarial learning to improve reconstruction.',
            evidence: 'Both studies used 18 fixed-cell mitochondrial samples. Their visual comparisons and reported PSNR and SSIM plots favor physics-informed unrolling over the respective non-physics baselines, but neither paper reports an independent external test.',
            figurePlaceholder: 'UPIGAN GAN block diagram: assets/images/work/upigan-gan-block-diagram.png',
            links: [
                { label: 'USR paper', href: 'https://doi.org/10.1364/3D.2023.JTu4A.42' },
                { label: 'UPIGAN paper', href: 'https://doi.org/10.1117/12.2663268' }
            ]
        },
        {
            title: 'Map901: Indoor Hazard Mapping for Public Safety',
            problem: 'Emergency responders need more than floor plans: they need to know where safety-critical objects are inside complex buildings.',
            method: 'The Map901 team combined backpack LiDAR and 360° video, segmented safety objects in images, transferred their labels into 3D point clouds, and stitched and georeferenced the building scans.',
            evidence: 'The studies surveyed seven Memphis buildings totaling 1.86 million square feet and addressed 30 classes of public-safety objects. The expanded study used 2,964 labeled images; its 3D maps still required manual cleanup of some labels.',
            figurePlaceholder: 'Map901 project banner: assets/images/work/w-1.png',
            links: [
                { label: '2021 conference paper', href: 'https://doi.org/10.5220/0010454400450056' },
                { label: '2022 book chapter', href: 'https://doi.org/10.1007/978-3-031-17098-0_9' }
            ]
        }
    ];
}
