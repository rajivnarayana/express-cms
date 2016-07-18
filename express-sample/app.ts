import * as express from "express";
import { OK, INTERNAL_SERVER_ERROR } from "http-status-codes";
const app : express.Application = express();
import * as path from 'path';
import * as jade from "jade";
import {adminRouter as cmsAdminRouter, router as cmsRouter} from "cms";

import * as mongoose from "mongoose";

mongoose.connect(process.env.MONGOURL || 'mongodb://localhost/cms-test');

app.get('/', (request : express.Request, response : express.Response) => {
    response.status(OK).send("Hello World");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', cmsRouter);
app.use('/admin/cms', cmsAdminRouter);

app.use((req, res, next) => {
    if (res.html) {
        res.render('layout', {html : {content : res.html, title : 'CMS'}});
        delete res.html;
    } else {
        next();
    }
})
app.use((error: Error , req, res, next) => {
   res.status(error.code < 600 ? error.code : INTERNAL_SERVER_ERROR || INTERNAL_SERVER_ERROR).send({errors: [{error: error.message || error.error}]}) 
});

export = app;