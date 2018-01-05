module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 未知状态统一使用 500
    const status = err.status || 500;
    ctx.response.status = status;

    const acceptedType = ctx.accepts('json', 'html', 'text');

    switch (acceptedType) {
      case 'text':
        ctx.type = 'text/plain';
        ctx.body = err.message;
        break;
      case 'json':
        ctx.response.type = 'application/json';
        ctx.response.body = { code: '-1', msg: 'Server Error' };
        break;
      case 'html':
      default:
        // 默认返回页面
        // ctx.type = 'text/plain';
        // ctx.body = ctx.body = err.message;
        break;
    }
    ctx.app.emit('error', err, ctx);
  }
};
