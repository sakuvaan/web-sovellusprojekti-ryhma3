import request from "supertest";
import app from "../src/app.js";

describe("User account", () => {
  it("deletes logged-in user account", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/signup").send({
      email: "delete@test.com",
      password: "Password123"
    });

    await agent.post("/api/auth/signin").send({
      email: "delete@test.com",
      password: "Password123"
    });

    const res = await agent.delete("/api/users/delete").send({ password: "Password123" });

    expect(res.statusCode).toBe(200);
  });
});

describe("User negative cases", () => {
  it("fails to delete account without password", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/signup").send({
      email: "nopass@test.com",
      password: "Password1"
    });

    await agent.post("/api/auth/signin").send({
      email: "nopass@test.com",
      password: "Password1"
    });

    const res = await agent.delete("/api/users/delete");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Password is required");
  });

  it("fails to change password with wrong current password", async () => {
    const agent = request.agent(app);

    await agent.post("/api/auth/signup").send({
      email: "changepass@test.com",
      password: "Password1"
    });

    await agent.post("/api/auth/signin").send({
      email: "changepass@test.com",
      password: "Password1"
    });

    const res = await agent.post("/api/users/change-password").send({
      currentPassword: "WrongPassword1",
      newPassword: "Password2",
      confirmNewPassword: "Password2"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Current password is incorrect");
  });
});
