const sse = require('../libs/sse');
const apiConfig = require('../config/api');

module.exports = () => async (ctx, next) => {
  if (ctx.path.indexOf(apiConfig.ALIVE_PREFIX) > -1) {
    // otherwise node will automatically close this connection in 10 minutes.
    ctx.req.setTimeout(1000 * 60 * 10);
    ctx.type = 'text/event-stream; charset=utf-8';
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');
    ctx.set('X-Accel-Buffering', 'no');
  }

  console.log('SSE keys :::', Object.keys(global.table));
  await next();
};
