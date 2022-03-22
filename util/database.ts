import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku.js';

setPostgresDefaultsOnHeroku();

config();

export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

type Session = {
  id: number;
  token: string;
  userId: number;
};

export type Category = {
  id: number;
  userId: number;
  name: string;
  monthlyBudget: number;
};

export type Expense = {
  id: number;
  userId: number;
  categoryId: number;
  name: string;
  price: number;
  date: string;
};

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

export async function getUserByUsername(username: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
  SELECT
    id
  FROM
    users
  WHERE
    username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
  SELECT
    id,
    username,
    password_hash
  FROM
    users
  WHERE
    username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
  SELECT
    id,
    username
  FROM
    users
  WHERE
    id = ${id}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserByValidSessionToken(token: string | undefined) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      users.id,
      users.username
    FROM
      users,
      sessions
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now()
  `;
  return user && camelcaseKeys(user);
}

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

export async function createSession(token: string, userId: number) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
  (token, user_id)
  VALUES
  (${token}, ${userId})
  RETURNING
  id,
  token
  `;
  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
  sessions
  WHERE
    token = ${token}
  RETURNING *
`;
  return session && camelcaseKeys(session);
}

export async function getValidSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  SELECT
   *
  FROM
    sessions
  WHERE
  token = ${token} AND
  expiry_timestamp > now()
`;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

export async function createCategory(
  userId: number,
  categoryName: string,
  budget: number,
) {
  const [category] = await sql<[Category]>`
    INSERT INTO categories
      (user_id, name, monthly_budget)
    VALUES
      (${userId}, ${categoryName}, ${budget})
    RETURNING *
  `;
  return camelcaseKeys(category);
}

export async function getCategorybyUserId(
  userId: number,
  categoryName: string,
) {
  const [category] = await sql<[Category | undefined]>`
  SELECT
  *
  FROM
  categories
  WHERE
  user_id = ${userId} AND
  name = ${categoryName}
  `;
  return category && camelcaseKeys(category);
}

export async function getAllCategoriesbyUserId(userId: number) {
  const categories = await sql<Category[]>`
  SELECT
  id,
  user_id,
  name,
  monthly_budget
  FROM
  categories
  WHERE
  user_id = ${userId}
  `;
  return categories.map((category) => camelcaseKeys(category));
}

export async function createExpense(
  userId: number,
  categoryId: number,
  name: string,
  price: number,
  date: string,
) {
  const [expense] = await sql<[Expense]>`
    INSERT INTO expenses
      (user_id, category_id, name, price, date)
    VALUES
      (${userId}, ${categoryId}, ${name}, ${price}, ${date})
    RETURNING *
  `;
  return camelcaseKeys(expense);
}

export async function getAllExpensesByUserId(userId: number) {
  const expenses = await sql<Expense[]>`
      SELECT
        id,
        category_id,
        name,
        price,
        date
    FROM
        expenses
    WHERE
        user_id = ${userId}
    `;
  return expenses.map((expense) => camelcaseKeys(expense));
}

export async function getFirstExpenseByCategory(categoryId: number) {
  const [expense] = await sql<[Expense | undefined]>`
    SELECT
      id,
      name,
      category_id
    FROM
      expenses
    WHERE
      category_id = ${categoryId}
    LIMIT 1
  `;
  return expense && camelcaseKeys(expense);
}

export async function deleteCategoryById(categoryId: number) {
  const [category] = await sql<[Category]>`
    DELETE FROM
      categories
    WHERE
      id = ${categoryId}
  `;
  return category;
}

export async function deleteExpenseById(expenseId: number) {
  const [expense] = await sql<[Expense]>`
    DELETE FROM
      expenses
    WHERE
      id = ${expenseId}
  `;
  return expense;
}

export async function getExpensesPerCategory() {
  const expenses = await sql<Expense[]>`
    SELECT
      DISTINCT category_id
    FROM
      expenses
  `;
  return expenses.map((expense) => camelcaseKeys(expense));
}

export async function getExpensesByMonthByUser(
  month: number,
  year: number,
  userId: number,
) {
  const expenses = await sql<Expense[]>`
    SELECT
      *
    FROM
      expenses
    WHERE
      EXTRACT(MONTH FROM date) = ${month} AND
      EXTRACT(YEAR FROM date) = ${year} AND
      user_id = ${userId}

  `;
  return expenses.map((expense) => camelcaseKeys(expense));
}

export async function getExpensesByYearByUser(year: number, userId: number) {
  const expenses = await sql<Expense[]>`
    SELECT
      *
    FROM
      expenses
    WHERE
      EXTRACT(YEAR FROM date) = ${year} AND
      user_id = ${userId}

  `;
  return expenses.map((expense) => camelcaseKeys(expense));
}

export async function updateCategoryNameAndBudget(
  categoryId: number,
  newCategoryName: string,
  newCategoryBudget: number,
) {
  const [category] = await sql<Category[]>`
    UPDATE
      categories
    SET
      name = ${newCategoryName},
      monthly_budget = ${newCategoryBudget}
    WHERE
      id = ${categoryId}
  `;
  return camelcaseKeys(category);
}

export async function updateCategoryName(
  categoryId: number,
  newCategoryName: string,
) {
  const [category] = await sql<Category[]>`
    UPDATE
      categories
    SET
      name = ${newCategoryName}
    WHERE
      id = ${categoryId}
  `;
  return camelcaseKeys(category);
}

export async function updateCategoryBudget(
  categoryId: number,
  newCategoryBudget: number,
) {
  const [category] = await sql<Category[]>`
    UPDATE
      categories
    SET
      monthly_budget = ${newCategoryBudget}
    WHERE
      id = ${categoryId}
  `;
  return camelcaseKeys(category);
}
