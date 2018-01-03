const redis = require('redis');
const dbSettings = require('../config/db');
// console.log(dbSettings);
const client = redis.createClient(dbSettings);

client.on('error', err => {
  console.log('Redis error  ', err);
});

client.on('warning', warn => {
  console.log('Redis warn  ', warn);
});

client.on('connect', () => {
  console.log('Redis connected.');
});

client.on('reconnecting', () => {
  console.log('Redis trying to reconnect to the Redis sever.');
});

client.on('end', () => {
  console.log('Redis server connection has closed.'); 
});

module.exports = client;