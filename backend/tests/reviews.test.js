import request from "supertest";
import app from "../src/app.js";

describe("Reviews", () => {
  it("returns a list of reviews", async () => {
    const res = await request(app)
      .get("/api/reviews/10991");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
