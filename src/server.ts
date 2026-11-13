/* @agent Read: .agents/skills/portfolio-angular/SKILL.md
Policy: README.md#behavioral-contracts; docs/README.md
Architecture and content ownership: docs/README.md; Tests: src/server.test.mjs */
// TODO<Verification>[VERIFY-01]: Netlify handler export does not prove standalone HTTP listening; see docs/NETLIFY_SSR_NOTES.md and active plan.
import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { getAllowedHosts, getContext, getTrustProxyHeaders } from '@netlify/angular-runtime/app-engine.js'

import { writingFeedResponse } from './writing-feed';

const angularAppEngine = new AngularAppEngine({
    allowedHosts: getAllowedHosts(),
    trustProxyHeaders: getTrustProxyHeaders(),
})

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
    const context = getContext()

    const pathname = new URL(request.url).pathname;
    if (pathname === "/feed") {
        return writingFeedResponse();
    }

    // Netlify serves existing static files before this handler. Missing scripts must
    // not enter Angular's document wildcard and become a successful HTML response.
    if (/\.m?js$/i.test(pathname)) {
        return new Response('Not found', { status: 404 });
    }

    const result = await angularAppEngine.handle(request, context)
    return result || new Response('Not found', { status: 404 })
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler)
