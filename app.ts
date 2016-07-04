import * as express from "express";
import { OK, INTERNAL_SERVER_ERROR } from "http-status-codes";
const app : express.Application = express();

app.get('/', (request : express.Request, response : express.Response) => {
    response.status(OK).send("Hello World");
});

app.use((error: Error , req, res, next) => {
   res.status(error.code < 600 ? error.code : INTERNAL_SERVER_ERROR || INTERNAL_SERVER_ERROR).send({errors: [{error: error.message || error.error}]}) 
});

export = app;