/**
 * Created by lin on 2017/6/8.
 */
const crypto = require('crypto');
var nowDate = new Date();
const hash = crypto.createHmac('sha256', nowDate.getTime().toString())
    .update('base64Data')
    .digest('hex');
console.log(hash);