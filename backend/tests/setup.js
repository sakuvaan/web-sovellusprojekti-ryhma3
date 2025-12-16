import { pool } from "../config/db.js";

beforeAll(async () => {
  await pool.query("BEGIN");
});

afterEach(async () => {
  await pool.query("ROLLBACK");
  await pool.query("BEGIN");
});
