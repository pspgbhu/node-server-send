module.exports = () => async (ctx, next) => {
  // error handler for server api
  if (/^\/api\/v1\/server/.test(ctx.path)) {
    try {
      await next()
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: '-1',
        msg: 'Server Side Error',
      };
    }

  } else {
    await next();
  }
};
