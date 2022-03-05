exports.up = async (sql) => {
  await sql`
  CREATE TABLE categories (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		user_id integer REFERENCES users (id) ON DELETE CASCADE,
		name varchar(30) NOT NULL,
		monthly_budget integer NOT NULL,
    creation_date timestamp NOT NULL DEFAULT NOW()
	);
	`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE categories
  `;
};
