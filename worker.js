import { createApp } from './.output/server/index.mjs';

export default {
  async fetch(request, env, ctx) {
    const app = await createApp();
    return app.fetch(request, env, ctx);
  }
}
