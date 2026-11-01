import xml2js from 'xml2js';

export async function writingFeedResponse(): Promise<Response> {
    try {
        // Bound the entire upstream request, including reading its body.
        const response = await fetch('https://medium.com/feed/@hossain.mazharul', {
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) throw new Error('Feed request failed');
        const parser = new xml2js.Parser({ explicitArray: false });
        const json = await parser.parseStringPromise(await response.text());
        const items = json.rss?.channel?.item;
        // xml2js returns an object for a feed containing just one item.
        return Response.json(items ? (Array.isArray(items) ? items : [items]) : []);
    } catch (err) {
        const timedOut = err instanceof Error && ['TimeoutError', 'AbortError'].includes(err.name);
        return Response.json({ error: 'Writing feed is temporarily unavailable' }, {
            status: timedOut ? 504 : 502
        });
    }
}
