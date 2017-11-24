/**
 * Created by gequn06 on 2016/11/19.
 */
let mysql = require("mysql");
// 博客
module.exports =  mysql.createPool({
    host:     "localhost",
    user:     "xxxx",
    password: "xxxx",
    database: "blog"
});
