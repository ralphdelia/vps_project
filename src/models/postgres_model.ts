import { Client, QueryResult, QueryResultRow } from "pg";

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const password = process.env.POSTGRES_PW;
const database = process.env.POSTGRES_DATABASE;
const port = Number(process.env.POSTGRES_PORT);

async function pgQuery<T extends QueryResultRow>(
  sql: string,
): Promise<QueryResult<T> | null> {
  const config = { user, host, database, port };
  Object.assign(config, password ? password : {});

  const client = new Client(config);

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
