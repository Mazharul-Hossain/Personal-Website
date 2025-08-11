import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { getContext } from '@netlify/angular-runtime/context.mjs'

import https from 'https';
// import xml2js from 'xml2js';

const angularAppEngine = new AngularAppEngine()

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
    const context = getContext()

    const pathname = new URL(request.url).pathname;
    if (pathname === "/feed") {
        // Fetch XML from Medium using https
        const options = {
            hostname: 'medium.com',
            port: 443,
            path: '/feed/@hossain.mazharul',
            method: 'GET'
        };
        const xmlData: string = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => resolve(data));
                console.log("INFO", "Data received from medium.com");
            });
            req.on('error', reject);
            req.end();
        });
        // Parse XML to JSON
        const xml2js = await import('xml2js');
        const parser = new xml2js.Parser({ explicitArray: false });
        let json: any;
        try {
            console.log("INFO", "JSON parse start.");
            json = await parser.parseStringPromise(xmlData);
            console.log("INFO", "JSON parse complete.");
        } catch (err) {
            return new Response(JSON.stringify({ error: 'Failed to parse XML' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        // Optionally, extract only the items
        const items = json.rss && json.rss.channel && json.rss.channel.item ? json.rss.channel.item : [];
        return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const result = await angularAppEngine.handle(request, context)
    return result || new Response('Not found', { status: 404 })
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler)
