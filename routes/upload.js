/**
 * Created by lin on 2017/5/10.
 */
let path = require('path');
let fs = require('fs');
const crypto = require('crypto');
let express = require('express');
let db = require('../config/db');
let system = require('../config/system');
let router = express.Router();
const uuidV4 = require('uuid/v4');
let get_ip = require('ipware')().get_ip;
let log4js = require('log4js');
let log = log4js.getLogger("app");
router.post('/', function(req, res, next) {
    let ip = get_ip(req).clientIp;
    if(system.allowAccess.indexOf(ip) < 0){
        let err = new Error();
        err.message = ip + "没有权限";
        next(err);
        return;
    }
    //创建目录
    let nowDate = new Date();
    let directoryName = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
    try {
        require('fs').mkdirSync('./uploads/' + directoryName);
    } catch (e) {
        if (e.code !== 'EEXIST') {
	        log.error("Could not set up log directory, error was: ", e);
            console.error("Could not set up log directory, error was: ", e);
            process.exit(1);
        }
    }

    let arg = req.body;
    let data =  arg['data'];
    let type =  arg['type'];
    let filename =  arg['filename'];

    let fileType = "";
    if(type){
        fileType = type;
    }else if(filename && filename.lastIndexOf('.') >= 0){
        let lastDotIndex = filename.lastIndexOf('.');
        fileType = filename.slice(lastDotIndex + 1);
    }


    //组装文件路径
    let base64Data = data.replace(/^data:\w+\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    const hash = crypto.createHmac('sha256', nowDate.getTime().toString())
        .update(base64Data)
        .digest('hex');
    let storageName = "";
    if(fileType){
        storageName = hash + "." + fileType;
    }else{
        storageName = hash + ".jpg";
    }
    let targetPath = '/' + directoryName + "/" + storageName;
    let storageNamePath = path.join(__dirname, '../uploads' + targetPath);

    //写文件，写入数据库
    fs.writeFile(storageNamePath, dataBuffer,  function (err) {
        if (err) next(err);
        db.getConnection(function(err, connection) {
            if (err) {
                log.error(err);
                return;
            }
            connection.query(
                "INSERT INTO t_sys_uploadfile_his (ID , ACCESS_URL,TYPE,FILE_NAME,TARGET_PATH,SERVER_NAME,CREATE_TIME) VALUES (?,?,?,?,?,?,?)",
                [uuidV4(),req.connection.remoteAddress,fileType,filename,targetPath,system.serverId,nowDate],
                function(err){
                    connection.release();
                    if(err)log.error("sql Error: ", err);
                }
            );
        });

        res.writeHead(200, {'Content-Type': 'application/json', 'Connection': 'close' });
        res.end(JSON.stringify({"path":targetPath,"code":"success" , 'message':"成功上传"}));
    });
});

module.exports = router;
