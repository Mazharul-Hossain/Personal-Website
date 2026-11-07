/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md */
// TODO<Migration>[MIG-03]: xml2js returns unvalidated external data; narrow boundary types; see docs/BUNDLE_OPTIMIZATION_PLAN.md.
declare module "xml2js" {
    export class Parser {
        constructor(options?: Record<string, unknown>);
        parseStringPromise(xml: string): Promise<any>;
    }

    const xml2js: {
        Parser: typeof Parser;
    };

    export default xml2js;
}
