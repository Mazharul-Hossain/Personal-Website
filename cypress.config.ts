/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md */
import { defineConfig } from "cypress";

export default defineConfig({
    allowCypressEnv: false,
    e2e: {
        baseUrl: "http://127.0.0.1:4200"
    },
    component: {
        devServer: {
            framework: "angular",
            bundler: "webpack"
        },
        specPattern: "**/*.cy.ts"
    }
});
