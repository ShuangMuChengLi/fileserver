var express = require('express');
var get_ip = require('ipware')().get_ip;
var router = express.Router();
var log4js = require('log4js');
var log = log4js.getLogger("ip");
/* GET home page. */
router.get('/', function(req, res, next) {
  var ip_info = get_ip(req).clientIp;
  log.info(ip_info);
  res.end(ip_info);
});

module.exports = router;
