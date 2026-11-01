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

    const result = await angularAppEngine.handle(request, context)
    return result || new Response('Not found', { status: 404 })
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler)
