import { startServer, stopServer } from "./utils";
import { get, post } from "./request-promise";
describe("App tests", () => {
    beforeAll(async (done) => {
        await startServer();
        done();
    });

    afterAll(async (done) => {
        await stopServer();
        done();
    });

    it ("should return hello world for /", async(done) => {
        let {response, body} = await get('/');
        expect(response.statusCode).toBe(200);
        expect(body).toBe("Hello World");
        done(); 
    })
})