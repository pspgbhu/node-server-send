const Transform = require('stream').Transform;
const Readable = require('stream').Readable;
const inherits = require('util').inherits;

inherits(SSE, Transform);
inherits(Subscription, Readable);

module.exports = SSE;

function SSE(options) {
  options = options || {};
  Transform.call(this, options);

  this.subscription = new Subscription();
  // bind a writable stream to readable stream.
  this.subscription.pipe(this);
}

// readable.push will make it be called.
SSE.prototype._transform = function(data, enc, cb) {
  this.push(data.toString('utf-8'));
  cb();
};

SSE.prototype.send = function (json, msg = 'message') {
  if (typeof json !== 'string') { throw new Error('SEE.prototype.send accept string as param')}
  const datas = `event: ${msg}\ndata: ${json}\n\n`;
  this.subscription.push(datas);
}

SSE.prototype.end = function() {
  this.subscription.unpipe(this);
}


function Subscription(options) {
  options = options || {};
  Readable.call(this, options);
}

Subscription.prototype._read = function() {
};

