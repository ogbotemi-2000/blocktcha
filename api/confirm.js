import config from '../config.json' assert {type: "json"};
import {$} from 'execa';

export async function GET(request) {
    const rawBody = await request.text()
    return new Response(JSON.stringify({ query: request.query, verb: request.method, rawBody, body: request.body, config }))
}
