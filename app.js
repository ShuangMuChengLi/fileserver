var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var upload = require('./routes/upload');
var index = require('./routes/index');

var app = express();
var log4js = require('log4js');
var log = log4js.getLogger("app");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//handle request entity too large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/', index);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	if (req.headers.accept.match("image")) {
		next();
		return;
	}
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	log.error("Something went wrong:", err);
	res.writeHead(200, {'Content-Type': 'application/json', 'Connection': 'close'});
	res.end(JSON.stringify({"message": err.message, "code": "fail"}));
});

module.exports = app;
