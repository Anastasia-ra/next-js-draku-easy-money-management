exports.up = async (sql) => {
  await sql`
  CREATE TABLE expenses (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		user_id integer REFERENCES users (id) ON DELETE CASCADE,
		category_id integer REFERENCES categories (id) ON DELETE CASCADE,
		name varchar(40) NOT NULL,
		price integer NOT NULL,
    date date NOT NULL
	);
	`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE categories
  `;
};
