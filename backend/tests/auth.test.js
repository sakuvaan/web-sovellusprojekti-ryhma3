import request from "supertest";
import app from "../src/app.js";

describe("Auth", () => {
  it("registers a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "test@test.com",
        password: "Password123"
      });

    expect(res.statusCode).toBe(201);
  });

  it("logs in user with valid credentials", async () => {
    await request(app).post("/api/auth/signup").send({
      email: "login@test.com",
      password: "Password123"
    });

    const res = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "login@test.com",
        password: "Password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("logs out user", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/signup").send({
      email: "logout@test.com",
      password: "Password123"
    });

    await agent.post("/api/auth/signin").send({
      email: "logout@test.com",
      password: "Password123"
    });

    const res = await agent.post("/api/auth/logout");

    expect(res.statusCode).toBe(200);
  });
});

describe("Auth negative cases", () => {
  it("fails to register with invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "badpass@test.com",
        password: "short"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Password must be/);
  });

  it("fails to login with wrong password", async () => {
    await request(app).post("/api/auth/signup").send({
      email: "wrongpass@test.com",
      password: "Password1"
    });

    const res = await request(app)
      .post("/api/auth/signin")
      .send({
        email: "wrongpass@test.com",
        password: "WrongPassword1"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
