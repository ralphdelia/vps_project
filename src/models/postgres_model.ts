import { Client, QueryResult, QueryResultRow } from "pg";

async function pgQuery<T extends QueryResultRow>(
  sql: string,
): Promise<QueryResult<T> | null> {
  const client = new Client({
    user: "ralph",
    host: "localhost",
    database: "vps_app",
    port: 5432,
  });

  try {
    await client.connect();
    const res = await client.query(sql);

    return res;
  } catch (err) {
    console.error("Connection error", err);
    return null;
  } finally {
    await client.end();
  }
}

export default pgQuery;
