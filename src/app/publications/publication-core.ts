/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Model: src/app/publications/publication.model.ts; full citation details: src/app/publications/publication-details.ts */
import type { PublicationCore, PublicationResource } from "./publication.model";

// Array order preserves the original within-category bibliography order.
export const PUBLICATIONS = [
    {
        id: "gmoe-ad-2026",
        category: "journal",
        title: "GMoE-AD: Generalized Hyperspectral Anomaly Detection via Mixture-of-Experts and Domain-Invariant Learning",
        year: 2026,
        authors: ["M. Hossain", "A. Robinson", "C. Preza", "L. Wang"],
        venue: "Sensors",
        resources: {
            manuscript: "https://www.cs.memphis.edu/~lanwang/paper/sensors-26-05661-v2.pdf",
            publisher: "https://www.mdpi.com/1424-8220/26/17/5661",
            doi: "https://doi.org/10.3390/s26175661"
        },
        primaryResource: "doi"
    },
    {
        id: "ge-ad-2024",
        category: "journal",
        title: "Greedy Ensemble Hyperspectral Anomaly Detection",
        year: 2024,
        authors: ["M. Hossain", "M. Younis", "A. Robinson", "L. Wang", "C. Preza"],
        venue: "Journal of Imaging",
        resources: {
            manuscript: "https://www.cs.memphis.edu/~lanwang/paper/jimaging-10-00131.pdf",
            publisher: "https://www.mdpi.com/2313-433X/10/6/131",
            doi: "https://doi.org/10.3390/jimaging10060131"
        },
        primaryResource: "publisher"
    },
    {
        id: "interior-hazard-maps-2022",
        category: "journal",
        title: "Building Rich Interior Hazard Maps for Public Safety",
        year: 2022,
        authors: ["M. Hossain", "T. Ma", "T. Watson", "B. Simmers", "J. A. Khan", "E. Jacobs", "L. Wang"],
        venue: "Communications in Computer and Information Science",
        shortVenue: "Springer Communications in Computer and Information Science",
        resources: {
            manuscript: "https://www.cs.memphis.edu/~lanwang/paper/Springer_book_our_version.pdf",
            publisher: "https://link.springer.com/chapter/10.1007/978-3-031-17098-0_9",
            doi: "https://doi.org/10.1007/978-3-031-17098-0_9"
        },
        primaryResource: "doi"
    },
    {
        id: "uav-task-adaptation-2025",
        category: "conference",
        title: "Improving Semantic Segmentation through Task Adaptation for UAV Hyperspectral Agricultural Imagery",
        year: 2025,
        authors: ["M. Hossain", "A. Robinson", "L. Wang", "C. Preza"],
        venue: "Autonomous Air and Ground Sensing Systems for Agricultural Optimization and Phenotyping 2025",
        shortVenue: "SPIE Autonomous Air and Ground Sensing Systems",
        resources: {
            manuscript: "https://mazharul-hossain.github.io/paper/SPIE2025_SemanticSegmentation_HRViTUNet.pdf",
            slides: "https://mazharul-hossain.github.io/paper/13475-6_SPIE2025_SemanticSegmentation_HRViTUNet.pdf",
            publisher: "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13475/1347507/Improving-semantic-segmentation-through-task-adaptation-for-UAV-hyperspectral-agricultural/10.1117/12.3053426.short"
        },
        primaryResource: "publisher"
    },
    {
        id: "hyperspectral-detector-comparison-2024",
        category: "conference",
        title: "Investigation of Unsupervised and Supervised Hyperspectral Anomaly Detection",
        year: 2024,
        authors: ["M. Hossain", "A. Robinson", "L. Wang", "C. Preza"],
        venue: "Applications of Machine Learning 2024",
        resources: {
            manuscript: "https://www.cs.memphis.edu/~lanwang/paper/SPIE2024_unsupervised_HS_AD.pdf",
            publisher: "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13138/1313817/Investigation-of-unsupervised-and-supervised-hyperspectral-anomaly-detection/10.1117/12.3029916.short"
        },
        primaryResource: "manuscript"
    },
    {
        id: "explainability-survey-2023",
        category: "conference",
        title: "Explainability of Artificial Intelligence Systems: A Survey",
        year: 2023,
        authors: ["M. Hossain", "S. Das", "B. Krishnamurthy", "S. G. Shiva"],
        venue: "2023 International Symposium on Networks, Computers and Communications (ISNCC)",
        resources: {
            doi: "https://doi.org/10.1109/ISNCC58260.2023.10323642"
        },
        primaryResource: "doi"
    },
    {
        id: "usr-2023",
        category: "conference",
        title: "USR: Unrolled Super-Resolution with Deep Priors for Structured Illumination Microscopy",
        year: 2023,
        authors: ["S. P. Dajkhosh", "M. Hossain", "C. Preza"],
        venue: "Optica Imaging Congress",
        resources: {
            doi: "https://doi.org/10.1364/3D.2023.JTu4A.42"
        },
        primaryResource: "doi"
    },
    {
        id: "explainable-ml-requirements-2023",
        category: "conference",
        title: "Requirements Elicitation and Stakeholder Communications for Explainable Machine Learning Systems: State of the Art",
        year: 2023,
        authors: ["S. Das", "M. Hossain", "S. G. Shiva"],
        venue: "2023 International Conference on Information Technology (ICIT)",
        resources: {
            doi: "https://doi.org/10.1109/ICIT58056.2023.10225934"
        },
        primaryResource: "doi"
    },
    {
        id: "hue-ad-2023",
        category: "conference",
        title: "Hyperspectral Unmixing-based Anomaly Detection",
        year: 2023,
        authors: ["M. Younis", "M. Hossain", "A. L. Robinson", "L. Wang", "C. Preza"],
        venue: "Computational Imaging VII",
        resources: {
            manuscript: "https://www.cs.memphis.edu/~lanwang/paper/SPIE-conference23.pdf",
            doi: "https://doi.org/10.1117/12.2664706"
        },
        primaryResource: "manuscript"
    },
    {
        id: "upigan-2023",
        category: "conference",
        title: "Structured Illumination Microscope Image Reconstruction Using Unrolled Physics-Informed Generative Adversarial Network (UPIGAN)",
        year: 2023,
        authors: ["S. P. Dajkhosh", "M. Hossain", "C. Preza"],
        venue: "Computational Imaging VII",
        shortVenue: "SPIE Computational Imaging VII",
        resources: {
            doi: "https://doi.org/10.1117/12.2663268"
        },
        primaryResource: "doi"
    },
    {
        id: "indoor-point-clouds-2021",
        category: "conference",
        title: "Building Indoor Point Cloud Datasets with Object Annotation for Public Safety",
        year: 2021,
        authors: ["M. Hossain", "T. Ma", "T. Watson", "B. Simmers", "J. A. Khan", "E. Jacobs", "L. Wang"],
        venue: "Proceedings of the 10th International Conference on Smart Cities and Green ICT Systems (SMARTGREENS 2021)",
        resources: {
            manuscript: "https://www.cs.memphis.edu/~lanwang/paper/SMARTGREENS_2021_21_CR.pdf",
            publisher: "https://www.scitepress.org/PublicationsDetail.aspx?ID=upgJR0REHi8=&t=1",
            doi: "https://doi.org/10.5220/0010454400450056"
        },
        primaryResource: "manuscript"
    },
    {
        id: "hyperspectral-dissertation-2026",
        category: "thesis",
        title: "Investigation of Target Detection in Hyperspectral Images for Aided Target Recognition",
        year: 2026,
        authors: ["M. Hossain"],
        venue: "Electronic Theses and Dissertations Archive, 4001",
        resources: {
            archive: "https://digitalcommons.memphis.edu/etd/4001"
        },
        primaryResource: "archive"
    },
    {
        id: "indoor-segmentation-ms-2021",
        category: "thesis",
        title: "Instance Segmentation of Public Safety Objects in RGB Image from Indoor Scene to Build Rich Interior Hazard Maps",
        year: 2021,
        authors: ["M. Hossain"],
        venue: "Electronic Theses and Dissertations, 2200",
        resources: {
            archive: "https://digitalcommons.memphis.edu/etd/2200/"
        },
        primaryResource: "archive"
    },
    {
        id: "energy-management-bs-2014",
        category: "thesis",
        title: "A Tale of Energy Management in Heterogeneous Networks Using MDP",
        year: 2014,
        authors: ["M. Hossain"],
        venue: "Bangladesh University of Engineering and Technology",
        resources: {
            doi: "http://dx.doi.org/10.13140/RG.2.2.15611.84000"
        },
        primaryResource: "doi"
    }
] as const satisfies readonly PublicationCore[];

export type PublicationId = typeof PUBLICATIONS[number]["id"];

export function getPublication(id: PublicationId): PublicationCore & { readonly id: PublicationId } {
    const publication = PUBLICATIONS.find(record => record.id === id);
    if (!publication) throw new Error(`Unknown publication: ${id}`);
    return publication;
}

export function publicationResource(id: PublicationId, resource: PublicationResource): string {
    const url = getPublication(id).resources[resource];
    if (!url) throw new Error(`Publication ${id} has no ${resource} resource`);
    return url;
}

export function publicationLink(id: PublicationId, resource: PublicationResource, label: string) {
    return { publicationId: id, label, href: publicationResource(id, resource) };
}

export function publicationDoi(id: PublicationId): string {
    return new URL(publicationResource(id, "doi")).pathname.slice(1);
}

export function publicationAuthorSurnames(id: PublicationId): string {
    const names = getPublication(id).authors.map(name => name.split(" ").pop() || name);
    return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

export const SELECTED_PUBLICATION_IDS = [
    "gmoe-ad-2026",
    "uav-task-adaptation-2025",
    "ge-ad-2024",
    "upigan-2023",
    "interior-hazard-maps-2022"
] as const satisfies readonly PublicationId[];
