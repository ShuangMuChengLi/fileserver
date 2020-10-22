/**
 * Created by gequn06 on 2016/11/19.
 */
let mysql = require("mysql");
// 博客
module.exports =  mysql.createPool({
    host:     "www.linchaoqun.com",
    user:     "root",
    password: "g7845120",
    database: "blog"
});
