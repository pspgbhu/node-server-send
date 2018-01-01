const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('./middlewares/cors');

const routeClient = require('./routes/client');
const routeServer = require('./routes/server');

global.db = {};

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());

// app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(cors());

// routes
app.use(routeClient.routes(), routeClient.allowedMethods());
app.use(routeServer.routes(), routeServer.allowedMethods());

module.exports = app;
