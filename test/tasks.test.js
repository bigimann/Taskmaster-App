const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

describe("Task Management Tests", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      email: "test5@gmail.com",
      password: "Gods1290",
    });
    token = res.body.token;
  });

  it("should create a new task", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task.",
        priority: "medium",
        deadline: "2024-11-16",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  it("should retrieve tasks", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Disconnect MongoDB after tests
  });
});
