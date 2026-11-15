/* @agent Read: .agents/skills/portfolio-angular/SKILL.md; .agents/skills/portfolio-content/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Consumers: src/app/index-page/index-page.component.ts; src/app/index-page/index-page.component.html; src/app/nav-footer/nav-footer.component.ts; src/app/nav-footer/nav-footer.component.html */
interface SocialProfile {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly icon: string;
}

export const SOCIAL_PROFILES = [
    { id: 'stackoverflow', label: 'Stack Overflow', href: 'https://stackoverflow.com/u/2049763/', icon: 'lni-stackoverflow' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/Mazharul-Hossain/', icon: 'lni-github-original' },
    { id: 'leetcode', label: 'LeetCode', href: 'https://leetcode.com/hossainmazhar/', icon: 'lni-code-alt' },
    { id: 'scholar', label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=SGyRAu8AAAAJ', icon: 'lni-keyword-research' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/hossainmazhar/', icon: 'lni-linkedin-original' },
    { id: 'medium', label: 'Medium', href: 'https://medium.hmazharul.com/', icon: 'lni-medium' }
] as const satisfies readonly SocialProfile[];

// The hero preserves its five existing profiles; the footer additionally offers Medium.
export const HERO_SOCIAL_PROFILES: readonly SocialProfile[] = SOCIAL_PROFILES.filter(profile => profile.id !== 'medium');
