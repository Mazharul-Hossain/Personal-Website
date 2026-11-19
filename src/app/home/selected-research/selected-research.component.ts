/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/home/selected-research/selected-research.component.html; Styles: src/app/home/selected-research/selected-research.component.css
Paper references: src/app/publications/publication-core.ts; attribution remains figure-specific. */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, TemplateRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { WindowRef } from '../../shared/window.token';
import { ChunkLoadRecoveryService } from '../../shared/chunk-load-recovery.service';
import type { ImagePopup, ImagePreview } from '../../shared/image-popup';
import { getPublication, publicationAuthorSurnames, publicationDoi, publicationLink } from "../../publications/publication-core";
import type { PublicationId } from "../../publications/publication-core";

const gmoe = getPublication("gmoe-ad-2026");
const gead = getPublication("ge-ad-2024");
const upigan = getPublication("upigan-2023");

interface ResearchStudy {
    title: string;
    layout?: 'horizontal';
    problem: string;
    method: string;
    evidence: string;
    figures: ResearchFigure[];
    links: Array<{ label: string; href: string; publicationId?: PublicationId }>;
}

interface ResearchFigure {
    src?: string;
    webpSrc?: string;
    width?: number;
    height?: number;
    alt?: string;
    caption?: string;
    placeholder?: string;
}

@Component({
    selector: 'app-selected-research',
    templateUrl: './selected-research.component.html',
    styleUrl: './selected-research.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SelectedResearchComponent implements OnDestroy {
    @ViewChild('imagePopup') private imagePopup!: TemplateRef<{ $implicit: ImagePreview }>;
    private readonly injector = inject(Injector);
    private readonly view = inject(ViewContainerRef);
    private readonly windowRef = inject(WindowRef);
    private readonly recovery = inject(ChunkLoadRecoveryService);
    private readonly changeDetector = inject(ChangeDetectorRef);
    private popup?: ImagePopup;
    private opening = false;
    private destroyed = false;
    previewError?: ImagePreview;

    async openImagePopup(figure: ResearchFigure, opener: HTMLButtonElement): Promise<void> {
        const browser = this.windowRef.nativeWindow();
        if (!browser || !figure.src || this.opening || this.popup || this.destroyed) return;
        this.opening = true;
        this.previewError = undefined;
        const image: ImagePreview = { ...figure, src: figure.src, alt: figure.alt || 'Research image' };
        try {
            const { ImagePopup } = await import('../../shared/image-popup');
            if (!this.destroyed && opener.isConnected) {
                this.popup = new ImagePopup(this.injector, this.imagePopup, this.view, image, opener, () => this.closeImagePopup());
            }
        } catch (error) {
            if (!this.destroyed && !this.recovery.tryReload(browser.location.href, error)) {
                this.previewError = image;
                this.changeDetector.markForCheck();
            }
        } finally {
            this.opening = false;
        }
    }

    closeImagePopup(): void {
        this.popup?.dispose(true);
        this.popup = undefined;
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        // Navigation owns the next focus destination; do not focus the departing view.
        this.popup?.dispose();
        this.popup = undefined;
    }

    readonly studies: ResearchStudy[] = [
        {
            title: 'Hyperspectral Anomaly Detection Across Sensors',
            problem: 'Rare anomalies and changing backgrounds make it hard for any single detector to work reliably across hyperspectral scenes and sensors.',
            method: 'HUE-AD combined spectral-abundance estimates with three anomaly detectors by equal vote. GE-AD replaced fixed selection and weights with a learned ensemble; a later study compared supervised and unsupervised variants. GMoE-AD added neural experts and domain-adversarial training for cross-domain detection.',
            evidence: 'GE-AD averaged 86.5% F1-macro on eight public images. GMoE-AD averaged 0.943 ROC-AUC across 22 images from seven datasets with multi-domain training and 0.910 in leave-one-dataset-out evaluation.',
            figures: [
                {
                    src: 'assets/images/work/gmoe-ad-graphical-abstract.png',
                    width: 550,
                    height: 184,
                    webpSrc: 'assets/images/work/gmoe-ad-graphical-abstract.webp',
                    alt: 'GMoE-AD graphical abstract',
                    caption: `GMoE-AD combines neural experts and domain-adversarial learning for cross-domain detection. Graphical abstract: Hossain et al., ${gmoe.venue}, ${gmoe.year}, doi:${publicationDoi(gmoe.id)}. © 2026 the authors; CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).`
                },
                {
                    src: 'assets/images/work/ge-ad-graphical-abstract.png',
                    width: 550,
                    height: 293,
                    webpSrc: 'assets/images/work/ge-ad-graphical-abstract.webp',
                    alt: 'GE-AD graphical abstract',
                    caption: `GE-AD selects and combines complementary anomaly detectors using a greedy ensemble. Graphical abstract: Hossain et al., ${gead.venue}, ${gead.year}, doi:${publicationDoi(gead.id)}. © 2024 the authors; CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).`
                }
            ],
            links: [
                publicationLink("gmoe-ad-2026", "publisher", "GMoE-AD paper"),
                publicationLink("ge-ad-2024", "publisher", "GE-AD paper"),
                // TODO<Content>[CONTENT-ARXIV]: establish the arXiv/published version relationship; see docs/BUNDLE_OPTIMIZATION_PLAN.md.
                { label: 'Ensemble comparison', href: 'https://arxiv.org/abs/2408.07114' },
                publicationLink("hue-ad-2023", "doi", "HUE-AD paper")
            ]
        },
        {
            title: 'Continuous Pose Refinement for Cryo-EM',
            problem: 'Cryo-EM reconstruction depends on estimating the orientations and image-plane shifts of noisy particle images relative to a reference volume.',
            method: 'Continuous in-plane polishing jointly refines two image-plane shifts and one rotation after discrete matching. Cartesian pose refinement extends this to five parameters—two shifts and three rotational degrees of freedom—using Levenberg–Marquardt optimization. A dedicated local 3D workflow refines existing particle poses against saved reference maps, with optional Gaussian shift and Matrix–Fisher rotation priors to regularize translational and rotational updates.',
            evidence: 'Public source code and numerical and workflow regression tests document these research-software contributions. Experimental reconstruction-quality results are not reported here.',
            figures: [
                {
                    src: 'assets/images/work/simple-pose-refinement.svg',
                    width: 720,
                    height: 440,
                    alt: 'Conceptual SIMPLE workflow with a real human 80S ribosome density volume, EMDB EMD-2938, illustrating the reference for rotation and shift refinement',
                    caption: 'Conceptual illustration of continuous pose refinement in SIMPLE; not an experimental result from this work. Example reference volume: human 80S ribosome, EMDB EMD-2938, Khatter et al. (2015), CC0. Source: https://www.ebi.ac.uk/emdb/EMD-2938.'
                }
            ],
            links: [
                { label: 'SIMPLE software', href: 'https://github.com/hael/SIMPLE' },
                { label: 'Local refinement code', href: 'https://github.com/hael/SIMPLE/commit/0c4801f6193c605e73c9c3bd82b4d78b91ad7b65' },
                { label: 'Rotation and shift priors', href: 'https://github.com/hael/SIMPLE/commit/f68dab7b0db3b62f2533cfb3f561292418b0c288' }
            ]
        },
        {
            title: 'Physics-Informed Reconstruction for 3D Microscopy',
            problem: 'Reconstructing 3D structured-illumination microscopy images from noisy measurements requires both fine detail and fidelity to how the microscope forms an image.',
            method: 'USR combines a learned image prior with repeated corrections based on the microscope point spread function. UPIGAN extends this physics-informed, unrolled approach with adversarial learning to improve reconstruction.',
            evidence: 'Both studies used 18 fixed-cell mitochondrial samples. Their visual comparisons and reported PSNR and SSIM plots favor physics-informed unrolling over the respective non-physics baselines, but neither paper reports an independent external test.',
            figures: [
                {
                    src: 'assets/images/work/upigan-gan-block-diagram.png',
                    width: 1240,
                    height: 1065,
                    alt: 'UPIGAN GAN block diagram',
                    caption: `UPIGAN discriminator and generator architecture, including the microscope point spread function. ${publicationAuthorSurnames(upigan.id)}, ${upigan.venue}, SPIE, ${upigan.year}, Figure 3, doi:${publicationDoi(upigan.id)}.`
                }
            ],
            links: [
                publicationLink("usr-2023", "doi", "USR paper"),
                publicationLink("upigan-2023", "doi", "UPIGAN paper")
            ]
        },
        {
            title: 'Map901: Indoor Hazard Mapping for Public Safety',
            layout: 'horizontal',
            problem: 'Emergency responders need more than floor plans: they need to know where safety-critical objects are inside complex buildings.',
            method: 'The Map901 team combined backpack LiDAR and 360° video, segmented safety objects in images, transferred their labels into 3D point clouds, and stitched and georeferenced the building scans.',
            evidence: 'The studies surveyed seven Memphis buildings totaling 1.86 million square feet and addressed 30 classes of public-safety objects. The expanded study used 2,964 labeled images; its 3D maps still required manual cleanup of some labels.',
            figures: [
                {
                    src: 'assets/images/work/w-1.png',
                    webpSrc: 'assets/images/next_gen/work/w-1.webp',
                    width: 720,
                    height: 360,
                    alt: 'Map901 project banner',
                    caption: 'Map901 project website banner. Source: map901.memphis.edu.'
                }
            ],
            links: [
                publicationLink("indoor-point-clouds-2021", "doi", "2021 conference paper"),
                publicationLink("interior-hazard-maps-2022", "doi", "2022 book chapter")
            ]
        }
    ];
}
