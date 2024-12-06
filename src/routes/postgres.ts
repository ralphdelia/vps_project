import express, { Request, Response } from "express";
import pgQuery from "../models/postgres_model";

/*
CREATE TABLE pings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/

interface PingRecord {
  id: number;
  createdAt: string;
  dbTime: number;
}

interface DeletedResponse {
  id?: number;
  createdAt?: string;
  dbTime?: number;
  pingDeleted: boolean;
}

interface ErrorResponse {
  error: string;
}

const postgresRouter = express.Router();

//create a ping
postgresRouter.post(
  "/ping",
  async (_req: Request, res: Response<PingRecord | ErrorResponse>) => {
    try {
      const startTime = Date.now();
      const result = await pgQuery<PingRecord>(
        `INSERT INTO pings
          DEFAULT VALUES
          RETURNING id,
          TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt";`,
      );
      const dbTime = Date.now() - startTime;

      if (!result || result.rowCount === 0) {
        res.status(500).json({ error: "Something went wrong with the DB" });
        return;
      }
      res.json({ ...result.rows[0], dbTime });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

//get all pings
postgresRouter.get(
  "/ping",
  async (_req: Request, res: Response<PingRecord[] | ErrorResponse>) => {
    try {
      const startTime = Date.now();
      const result = await pgQuery<PingRecord>(
        `SELECT id,
          TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt"
        FROM pings;`,
      );
      const dbTime = Date.now() - startTime;

      if (!result) {
        throw new Error("No result from pgQuery");
      }

      if (result.rowCount === 0) {
        res.json([]);
        return;
      }

      res.json(result.rows.map((p) => ({ ...p, dbTime })));
    } catch (err: unknown) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

//delete the last ping by date
postgresRouter.delete(
  "/ping",
  async (req: Request, res: Response<DeletedResponse | ErrorResponse>) => {
    try {
      const startTime = Date.now();
      const result = await pgQuery<PingRecord>(`
        DELETE FROM pings
        WHERE id = (
          SELECT id
          FROM pings
          ORDER BY created_at DESC
          LIMIT 1
        )
        RETURNING id,
          TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt";

        `);
      const dbTime = Date.now() - startTime;

      if (!result || result.rowCount === 0) {
        res.json({ pingDeleted: false });
        return;
      }

      res.json({ ...result.rows[0], pingDeleted: true, dbTime });
    } catch (err: unknown) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default postgresRouter;
