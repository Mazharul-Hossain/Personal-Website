/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Lazy consumer: src/app/publications/publications.component.ts; shared facts: src/app/publications/publication-core.ts */
import type { PublicationId } from "./publication-core";
import type { PublicationCategory, PublicationDetail } from "./publication.model";

// Runtime imports of these details belong only to the lazy bibliography feature.
export const PUBLICATION_DETAILS: Readonly<Record<PublicationId, PublicationDetail>> = {
    "gmoe-ad-2026": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", 26(17), 5661, September " },
            { kind: "year" },
            { kind: "text", text: " [" },
            { kind: "resource", resource: "publisher", label: "publisher link" },
            { kind: "text", text: "]" },
        ]
    },
    "ge-ad-2024": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", 10 (6), 131, May " },
            { kind: "year" },
            { kind: "text", text: " [" },
            { kind: "resource", resource: "publisher", label: "publisher link" },
            { kind: "text", text: "]" },
        ]
    },
    "interior-hazard-maps-2022": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", vol 1612. Klein, C., Jarke, M., Helfert, M., Berns, K., Gusikhin, O. (eds) Smart Cities, Green Technologies, and Intelligent Transport Systems. VEHITS SMARTGREENS 2021, Springer, " },
            { kind: "year" },
            { kind: "text", text: " [" },
            { kind: "resource", resource: "publisher", label: "publisher link" },
            { kind: "text", text: "] (This is an extended version of our SMARTGREENS 2021 conference paper.)" },
        ]
    },
    "uav-task-adaptation-2025": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" in the 10th conference on " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", SPIE, May " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "slides", label: "Slides" },
            { kind: "text", text: " | " },
            { kind: "resource", resource: "publisher", label: "Publisher Link", newTab: false },
            { kind: "text", text: "]" },
        ]
    },
    "hyperspectral-detector-comparison-2024": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", Vol. 13138, pp. 251-261, SPIE, poster, October " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "publisher", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "explainability-survey-2023": {
        authorFormats: ["initial-first", "surname-first", "surname-first", "surname-first"],
        beforeTitle: ", \"",
        afterTitle: [
            { kind: "text", text: "\", In " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", pp. 1-6, IEEE, October " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "doi", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "usr-2023": {
        authorFormats: ["surname-first", "surname-first", "surname-first"],
        lastAuthorSeparator: ", & ",
        beforeTitle: ", \"",
        afterTitle: [
            { kind: "text", text: "\", in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", paper JTu4A.42, Optica Publishing Group, August " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "doi", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "explainable-ml-requirements-2023": {
        authorFormats: ["surname-first", "initial-first", "surname-first"],
        beforeTitle: ", \"",
        afterTitle: [
            { kind: "text", text: "\", in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", pp. 561-566, IEEE, August " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "doi", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "hue-ad-2023": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", Vol. 12523. SPIE, June " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "doi", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "upigan-2023": {
        authorFormats: ["surname-first", "initial-first", "surname-first"],
        lastAuthorSeparator: ", & ",
        beforeTitle: ", \"",
        afterTitle: [
            { kind: "text", text: ",\" in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", Vol. 12523, pp. 63-74, SPIE, June, " },
            { kind: "year" },
            { kind: "text", text: ". [" },
            { kind: "resource", resource: "doi", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "indoor-point-clouds-2021": {
        beforeTitle: ", \"",
        titleResource: "manuscript",
        afterTitle: [
            { kind: "text", text: ",\" in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", April " },
            { kind: "year" },
            { kind: "text", text: " [" },
            { kind: "resource", resource: "publisher", label: "Publisher Link" },
            { kind: "text", text: "]" },
        ]
    },
    "hyperspectral-dissertation-2026": {
        authorFormats: ["surname-first-no-period"],
        beforeTitle: ", \"",
        titleResource: "archive",
        afterTitle: [
            { kind: "text", text: "\", in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", Doctoral Dissertation, University of Memphis, May " },
            { kind: "year" },
            { kind: "text", text: "." },
        ]
    },
    "indoor-segmentation-ms-2021": {
        authorFormats: ["surname-first-no-period"],
        beforeTitle: ", \"",
        titleResource: "archive",
        afterTitle: [
            { kind: "text", text: "\", in " },
            { kind: "venue", italic: true },
            { kind: "text", text: ", MS Thesis, University of Memphis, August " },
            { kind: "year" },
            { kind: "text", text: "." },
        ]
    },
    "energy-management-bs-2014": {
        authorFormats: ["surname-first-no-period"],
        beforeTitle: ", \"",
        titleResource: "doi",
        afterTitle: [
            { kind: "text", text: "\", BS Thesis " },
            { kind: "venue", italic: false },
            { kind: "text", text: ", July " },
            { kind: "year" },
            { kind: "text", text: "." },
        ]
    },
};

export const PUBLICATION_CATEGORIES = [
    {
        "id": "journal",
        "title": "Book Chapters and Journal Papers"
    },
    {
        "id": "conference",
        "title": "Conference and Workshop Papers"
    },
    {
        "id": "thesis",
        "title": "Thesis and Dissertation"
    }
] as const satisfies readonly { id: PublicationCategory; title: string }[];
