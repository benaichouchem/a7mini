var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Defining our application routes
var indexRouter = require('./routes/index');
var dataRouter = require('./routes/getData');

var app = express();

//Defining the App's uses
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));


app.use('/', indexRouter);
console.log('getData');
app.use('/getData', dataRouter);

// app.get("/api/members", (req, res) => {
//     res.send("answer");
// });


module.exports = app;