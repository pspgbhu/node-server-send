const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const sseHeader = require('./middlewares/sseHeader');
const cors = require('./middlewares/cors');
const db = require('./libs/db');

const routeClient = require('./routes/client');
const routeServer = require('./routes/server');

global.table = {};

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());

if (process.env.NODE_ENV !== 'production') {
  app.use(require('koa-static')(__dirname + '/public'))
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
app.use(sseHeader());

// routes
app.use(routeClient.routes(), routeClient.allowedMethods());
app.use(routeServer.routes(), routeServer.allowedMethods());


module.exports = app;
