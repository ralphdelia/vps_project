import { Client, QueryResult, QueryResultRow } from "pg";

async function pgQuery<T extends QueryResultRow>(
  sql: string,
): Promise<QueryResult<T> | null> {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    port: Number(process.env.POSTGRES_PORT),
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
