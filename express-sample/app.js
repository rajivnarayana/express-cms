const express = require("express");
const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const app = express();
const path  = require('path');
const jade = require("jade");

const {adminRouter : cmsAdminRouter, router : cmsRouter} = require("express-cms");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOURL || 'mongodb://localhost/cms-test');

app.get('/', (request, response) => {
    response.status(OK).send("Hello World");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', cmsRouter);
app.use('/admin/cms', cmsAdminRouter);

app.use((req, res, next) => {
    if (res.html) {
        res.render('layout', {html : res.html, title : 'CMS'});
        delete res.html;
    } else {
        next();
    }
})
app.use((error , req, res, next) => {
   res.status(error.code < 600 ? error.code : INTERNAL_SERVER_ERROR || INTERNAL_SERVER_ERROR).send({errors: [{error: error.message || error.error}]}) 
});

module.exports = app;