import supertest from "supertest";
import app from "../app";

const request = supertest(app);

it('test app api', async () => {
    const response = await request.get('/api/images').query({filename: 'fjord'});
    expect(response.status).toBe(200);
});