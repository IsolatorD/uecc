var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var profesoresRouter = require('./routes/profesores');
var estudiantesRoutes = require('./routes/estudiantes');
var representantesRouter = require('./routes/representantes');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/profesores', profesoresRouter);
app.use('/estudiantes', estudiantesRoutes);
app.use('/representantes', representantesRouter);
//MLab: mongodb://yusma:yusma97@ds141796.mlab.com:41796/mediglobal
//mongodb://localhost:27017/uecc-12
mongoose.connect('mongodb://yusma:yusma97@ds141796.mlab.com:41796/mediglobal', (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log('Conectado a la Base de Datos.');
  }
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
