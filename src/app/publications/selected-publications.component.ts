/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Template: src/app/publications/selected-publications.component.html; Styles: src/app/publications/selected-publications.component.css
Data: src/app/publications/publication-core.ts; full details stay in the lazy feature. */
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { getPublication, publicationResource, SELECTED_PUBLICATION_IDS } from "./publication-core";
import { formatSelectedAuthors } from "./publication-format";

export { formatSelectedAuthors } from "./publication-format";

@Component({
    selector: 'app-selected-publications',
    templateUrl: './selected-publications.component.html',
    styleUrl: './selected-publications.component.css',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SelectedPublicationsComponent {
    readonly formatAuthors = formatSelectedAuthors;
    readonly publications = SELECTED_PUBLICATION_IDS.map(id => {
        const publication = getPublication(id);
        return {
            id,
            title: publication.title,
            year: publication.year,
            authors: publication.authors,
            venue: publication.shortVenue || publication.venue,
            url: publicationResource(id, publication.primaryResource)
        };
    });
}
