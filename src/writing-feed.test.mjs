import { afterEach, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { writingFeedResponse } from './writing-feed.ts';

afterEach(() => mock.restoreAll());

test('returns all items from the Medium feed', async () => {
    const fetch = mock.method(globalThis, 'fetch', async () => new Response(
        '<rss><channel><item><title>First</title></item><item><title>Second</title></item></channel></rss>'
    ));
    const response = await writingFeedResponse();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [{ title: 'First' }, { title: 'Second' }]);
    assert.equal(fetch.mock.calls[0].arguments[0], 'https://medium.com/feed/@hossain.mazharul');
    assert.ok(fetch.mock.calls[0].arguments[1].signal instanceof AbortSignal);
});

test('returns an array for a single feed item', async () => {
    mock.method(globalThis, 'fetch', async () => new Response('<rss><channel><item><title>Only</title></item></channel></rss>'));
    const response = await writingFeedResponse();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [{ title: 'Only' }]);
});

test('returns a 502 response when the upstream feed fails', async () => {
    mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }));
    const response = await writingFeedResponse();
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: 'Writing feed is temporarily unavailable' });
});

test('returns a 504 response when the upstream request times out', async () => {
    mock.method(globalThis, 'fetch', async () => { throw new DOMException('Timed out', 'TimeoutError'); });
    const response = await writingFeedResponse();
    assert.equal(response.status, 504);
    assert.deepEqual(await response.json(), { error: 'Writing feed is temporarily unavailable' });
});
