import { pool } from "../config/db.js";

export default async () => {
  await pool.end();
};
