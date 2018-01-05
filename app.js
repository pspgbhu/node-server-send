const Koa = require('koa');
const json = require('koa-json');
// const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require('path');

const sseMiddleware = require('./middlewares/sseMiddleware');
const cors = require('./middlewares/cors');
const err = require('./middlewares/err');
// const errorHandler = require('./middlewares/errorHandler');
const _404 = require('./middlewares/404');

const routeClient = require('./routes/client');
const routeServer = require('./routes/server');

require('./libs/db');

global.table = {};
global.IP = require('./libs/ip');

console.log('本机IP: ', global.IP);
console.log('process.env.NODE_ENV ==', process.env.NODE_ENV);

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

// if (process.env.NODE_ENV !== 'production') {
app.use(require('koa-static')(path.join('public')));
// }

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
app.use(sseMiddleware());

// routes
app.use(routeClient.routes(), routeClient.allowedMethods());
app.use(routeServer.routes(), routeServer.allowedMethods());


module.exports = app;
