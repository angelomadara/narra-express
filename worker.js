import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event);
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return new Response('Not Found', { status: 404 });
  }
}

// import { createApp } from './.output/server/index.mjs';

// export default {
//   async fetch(request, env, ctx) {
//     const app = await createApp();
//     return app.fetch(request, env, ctx);
//   }
// }
