import * as express from "express";
import { OK } from "http-status-codes";
const app : express.Application = express();

app.get('/', (request : express.Request, response : express.Response) => {
    response.status(OK).send("Hello World");
});

app.listen(3000, () => {
    console.log(`Listening on port ${3000}`);
})