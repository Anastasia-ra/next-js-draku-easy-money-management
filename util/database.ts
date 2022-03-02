import { config } from 'dotenv-safe';
import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';

config();

declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres();

    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852

    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function createUser(
  email: string,
  username: string,
  passwordHash: string,
) {
  const [user] = await sql<[User]>`
  INSERT INTO users
  (email, username, password_hash)
  VALUES
  (${email}, ${username}, ${passwordHash})
  RETURNING
  id,
  email,
  username
  `;
  return camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
  SELECT id FROM users WHERE username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
  SELECT id, username, password_hash FROM users WHERE username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
  SELECT id, username FROM users WHERE id = ${id}
  `;
  return user && camelcaseKeys(user);
}
