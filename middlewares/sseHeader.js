module.exports = () => async (ctx, next) => {
  if (/^\/alive/.test(ctx.path)) {
    // otherwise node will automatically close this connection in 10 minutes.
    ctx.req.setTimeout(1000 * 60 * 10);
    ctx.type = 'text/event-stream; charset=utf-8';
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');
    ctx.set('X-Accel-Buffering', 'no');
  }
  await next();
};
