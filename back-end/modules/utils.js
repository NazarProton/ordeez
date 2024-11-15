const validator = require('validator');
const httpStatus = require('http-status');
const _ = require('lodash');
const createKeccakHash = require('keccak');

exports.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
  return re.test(String(email).toLowerCase());
};

// exports.getIp = function(req) {
//   const ip = (req.headers['x-forwarded-for'] || '').split(',').pop()
//     || req.connection.remoteAddress
//     || req.socket.remoteAddress
//     || req.connection.socket.remoteAddress;
//   return ip;
// };

function getIpv4(ip) {
  let ipv4 = ip;
  if(ip.substr(0, 7) === '::ffff:') {
    ipv4 = ip.substr(7);
  }
  if(ip === '::1') {
    ipv4 = '127.0.0.1';
  }
  ipv4 = ipv4.trim();

  return validator.isIP(ipv4, 4) ? ipv4 : null;
}
exports.getIpv4 = getIpv4;

function getIpv6(ip) {
  let ipv6 = ip;
  if(ip.substr(0, 7) !== '::ffff:') {
    ipv6 = ip;
  }
  ipv6 = ipv6.trim();

  return validator.isIP(ipv6, 6) ? ipv6 : null;
}
exports.getIpv6 = getIpv6;

exports.getIp = function(req) {
  // const xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '');
  // let ip = (req.headers['x-forwarded-for'] || '').split(',').pop()
  let ip = (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress;
  ip = ip.trim();
  const ipv4 = getIpv4(ip);
  const ipv6 = getIpv6(ip);
  return ipv4 || ipv6 || '';
};

exports.errorResponse = (res, message) => res.status(httpStatus.BAD_REQUEST).json({ status: false, message });
exports.errorResponseWithCode = (res, message, code) => res.status(httpStatus.BAD_REQUEST).json({ status: false, message, code });

exports.reducedErrorMessage = (errorDetails) => {
  if(errorDetails.errors && errorDetails.errors.length > 0) {
    return _.get(errorDetails, 'errors[0].message', 'We have some technical difficulties. Please try again.');
  }
  return _.get(errorDetails, 'message', 'We have some technical difficulties. Please try again.');
};

exports.reducedUserData = userDetails => ({
  ..._.omit(userDetails, ['password'])
});

exports.getOffsetLimit = (data, maxLimit = 100) => {
  let offset = parseInt(data.offset, 10);
  if(!offset || Number.isNaN(offset)) offset = 0;
  offset = Math.max(offset, 0);

  let limit = parseInt(data.limit, 10);
  if(!limit || Number.isNaN(limit)) limit = maxLimit;
  limit = Math.max(1, limit);
  limit = Math.min(maxLimit, limit);

  return { offset, limit };
};

exports.sleep = (s = 1) => new Promise((r) => setTimeout(r, s * 1000));

exports.keccakHash = function nftHash(value) {
  return '0x' + createKeccakHash('keccak256').update(value).digest('hex');
};
