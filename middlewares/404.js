module.exports = () => async (ctx, next) => {
  await next();
  if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404);
};
