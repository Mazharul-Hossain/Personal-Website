/* @agent Read: .agents/skills/portfolio-verification/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Owner: AGENTS.md; checks local guidance integrity, not runtime contract compliance. */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const read = path => readFileSync(join(root, path), "utf8");
const exists = path => existsSync(resolve(root, path));
const walk = path => readdirSync(join(root, path), { withFileTypes: true }).flatMap(entry => {
    const child = `${path}/${entry.name}`;
    return entry.isDirectory() ? walk(child) : [child];
});
const check = (condition, message) => { if (!condition) failures.push(message); };

// Match only the deliberately small, single-line frontmatter schema used here.
// This is not a general YAML parser or a behavioral evaluation of a skill.
const skillPaths = walk(".agents/skills").filter(path => path.endsWith("/SKILL.md"));
for (const path of skillPaths) {
    const text = read(path);
    const match = text.match(/^---\r?\nname: ([a-z0-9]+(?:-[a-z0-9]+)*)\r?\ndescription: (.+)\r?\n---\r?\n/);
    check(Boolean(match), `${path}: expected name/description frontmatter`);
    if (match) {
        check(path.split("/").at(-2) === match[1] && match[1].length <= 64, `${path}: name must match folder`);
        check(match[2].startsWith("Use when ") && match[2].length <= 1024 && !/[<>]|: /.test(match[2]), `${path}: invalid plain-scalar description`);
    }
    check(!/^\[TODO:.*\]\s*$/m.test(text), `${path}: unfinished scaffold`);
}
check(skillPaths.length > 0, "No repository skills found");

const authored = [
    ...walk("src/app").filter(path => /\.(ts|html|css)$/.test(path)),
    ...walk("src/environments").filter(path => path.endsWith(".ts")),
    ...readdirSync(join(root, "src")).filter(path => /\.(ts|mjs)$/.test(path)).map(path => `src/${path}`),
    ...walk("cypress").filter(path => /\.(ts|html)$/.test(path)),
    "src/index.html", "src/assets/css/style.css", "src/assets/css/default.css",
    "cypress.config.ts", "karma.conf.js", "scripts/check-guidance.mjs"
];
let links = 0;
const activePlan = read("docs/BUNDLE_OPTIMIZATION_PLAN.md");
for (const path of authored) {
    const text = read(path);
    for (const marker of text.matchAll(/TODO<([^>]+)>\[([^\]]+)\]/g)) {
        check(["Migration", "Bug", "Design", "Verification", "Content"].includes(marker[1]), `${path}: unknown TODO category ${marker[1]}`);
        check(activePlan.includes(`| ${marker[2]} |`), `${path}: TODO ${marker[2]} has no active-register entry`);
    }
    const header = text.match(/^(?:\/\*|<!--) @agent Read: ([\s\S]*?)(?:\*\/|-->)/)?.[1];
    check(Boolean(header), `${path}: missing @agent reading pointer`);
    if (!header) continue;
    const targets = header.match(/(?:\.agents\/skills\/[a-z0-9-]+\/SKILL\.md|(?:src|docs|scripts|cypress)\/[\w./-]+\.[a-z]+|(?:README|AGENTS)\.md|angular\.json)/g) || [];
    for (const target of targets) {
        check(exists(target), `${path}: missing header target ${target}`);
        links++;
    }
    if (path.endsWith(".component.html") || path.endsWith(".component.css")) {
        const controller = path.replace(/\.(html|css)$/, ".ts");
        check(header.includes(controller), `${path}: missing controller pointer ${controller}`);
    }
}

for (const path of ["README.md", "AGENTS.md", ...walk("docs").filter(path => path.endsWith(".md")), ...skillPaths]) {
    for (const match of read(path).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = match[1].replace(/^<|>$/g, "").split("#")[0];
        if (!target || /^[a-z]+:/i.test(target)) continue;
        check(exists(join(dirname(path), decodeURIComponent(target))), `${path}: missing local link ${target}`);
        links++;
    }
}

check(/"strict"\s*:\s*true/.test(read("tsconfig.json")), "tsconfig.json: full strict mode must remain enabled");
if (failures.length) {
    failures.forEach(message => console.error(message));
    process.exitCode = 1;
} else {
    console.log(`Guidance valid: ${skillPaths.length} skills, ${authored.length} authored files, ${links} local references. Runtime contracts require their behavior tests.`);
}
