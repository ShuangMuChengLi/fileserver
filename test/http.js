/**
 * Created by lin on 2017/6/9.
 */
var http = require('http');
http.get("http://localhost:8081", (httpRes) => {
    var responseText=[];
    var size = 0;
    httpRes.on('data', function (data) {
        responseText.push(data);
        size+=data.length;
    });
    httpRes.on('end', function () {
        var data = responseText.join().toString();
        console.log(data);
    });

}).on('error',function(err){
});