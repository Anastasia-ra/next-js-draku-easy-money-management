exports.up = async (sql) => {
  await sql`
  CREATE TABLE emailReminders (
		id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
		user_id integer REFERENCES users (id) ON DELETE CASCADE,
		name varchar(40) NOT NULL,
		email varchar(120) NOT NULL,
		price integer NOT NULL,
    day integer NOT NULL
	);
	`;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE emailReminders
  `;
};
