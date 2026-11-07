/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/publications/publications.component.html; Styles: src/app/publications/publications.component.css
Data: src/app/publications/publication-core.ts; src/app/publications/publication-details.ts */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PUBLICATIONS, publicationResource } from "./publication-core";
import { PUBLICATION_CATEGORIES, PUBLICATION_DETAILS } from "./publication-details";
import { formatPublicationAuthor, OWNER_AUTHOR } from "./publication-format";

@Component({
    selector: 'app-publications',
    templateUrl: './publications.component.html',
    styleUrl: './publications.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PublicationsComponent {
    readonly resourceUrl = publicationResource;
    readonly categories = PUBLICATION_CATEGORIES.map(category => ({
        ...category,
        entries: PUBLICATIONS.filter(publication => publication.category === category.id).map(publication => {
            const detail = PUBLICATION_DETAILS[publication.id];
            return {
                publication,
                detail,
                authors: publication.authors.map((name, index) => ({
                    name: formatPublicationAuthor(name, detail.authorFormats?.[index]),
                    owner: name === OWNER_AUTHOR,
                    separator: index === publication.authors.length - 1 ? "" :
                        index === publication.authors.length - 2 ? detail.lastAuthorSeparator || ", " : ", "
                }))
            };
        })
    }));
}
