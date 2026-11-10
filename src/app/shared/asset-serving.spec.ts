/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/BUNDLE_OPTIMIZATION_PLAN.md
Implementation: angular.json; hero consumer: src/app/index-page/index-page.component.html */
describe("Karma application assets", () => {
    it("serves the real hero WebP at its application URL", async () => {
        const response = await fetch("/assets/images/next_gen/banner/hero.webp");
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toContain("image/webp");
        expect((await response.blob()).size).toBeGreaterThan(0);
    });
});
