// import { APP_BASE_HREF } from '@angular/common';
// import { CommonEngine, isMainModule } from '@angular/ssr/node';
import { CommonEngine } from '@angular/ssr/node';
import { render } from "@netlify/angular-runtime/common-engine.mjs";
// import express from 'express';
// import { dirname, join, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';
// import AppServerModule from './main.server';
import https from 'https';
import xml2js from 'xml2js';

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, '../browser');
// const indexHtml = join(serverDistFolder, 'index.server.html');

// const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

export async function netlifyCommonEngineHandler(request: Request, context: any): Promise<Response> {
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
            });
            req.on('error', reject);
            req.end();
        });
        // Parse XML to JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        let json: any;
        try {
            json = await parser.parseStringPromise(xmlData);
        } catch (err) {
            return new Response(JSON.stringify({ error: 'Failed to parse XML' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        // Optionally, extract only the items
        const items = json.rss && json.rss.channel && json.rss.channel.item ? json.rss.channel.item : [];
        return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return await render(commonEngine);
}

// app.get('/feed', (req, res) => {
//     const options = {
//         hostname: 'medium.com',
//         port: 443,
//         path: '/feed/@hossain.mazharul',
//         method: 'GET'
//     };
//     const externalRequest = https.request(options, (externalResponse) => {
//         res.writeHead(externalResponse.statusCode || 200, externalResponse.headers);
//         externalResponse.pipe(res);
//     });

//     externalRequest.on('error', (error) => {
//         console.error(`Problem with request: ${error.message}`);
//         res.status(500).send('Error fetching XML data');
//     });

//     externalRequest.end();
// });

// /**
//  * Serve static files from /browser
//  */
// app.get(
//     '**',
//     express.static(browserDistFolder, {
//         maxAge: '1y',
//         index: 'index.html'
//     }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.get('**', (req, res, next) => {
//     const { protocol, originalUrl, baseUrl, headers } = req;

//     commonEngine
//         .render({
//             bootstrap: AppServerModule,
//             documentFilePath: indexHtml,
//             url: `${protocol}://${headers.host}${originalUrl}`,
//             publicPath: browserDistFolder,
//             providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
//         })
//         .then((html) => res.send(html))
//         .catch((err) => next(err));
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//     const port = process.env['PORT'] || 4000;
//     app.listen(port, () => {
//         console.log(`Node Express server listening on http://localhost:${port}`);
//     });
// }

// export default app;
