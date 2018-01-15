const Koa = require('koa');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require('path');

const cors = require('./middlewares/cors');
const err = require('./middlewares/err');
const _404 = require('./middlewares/404');

const routes = require('./routes');

require('./libs/db');

global.table = {};
global.IP = require('./libs/ip');

console.log('本机IP: ', global.IP);
console.log('process.env.NODE_ENV ==', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
  console.log('\n     打开调试页面: http://localhost:3000\n');
}


const app = new Koa();

// error handler
app.use(err());
app.use(_404());

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));
app.use(json());
app.use(logger());

// 开发环境运行时挂载测试用 index.html
if (process.env.NODE_ENV !== 'production') {
  app.use(require('koa-static')(path.join('public')));
}

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// set CORS header
app.use(cors());

// set sse headers
// app.use(sseMiddleware());

// routes
app.use(routes.routes(), routes.allowedMethods());


module.exports = app;
