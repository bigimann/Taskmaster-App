const request = require("supertest");
const app = require("../server.js");

describe("Authentication Tests", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/register").send({
      username: "testuser5",
      email: "test5@gmail.com",
      password: "Gods1290",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should log in an existing user", async () => {
    const response = await request(app).post("/login").send({
      email: "test5@gmail.com",
      password: "Gods1290",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
