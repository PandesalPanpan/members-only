const { PG, Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR (255),
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    password VARCHAR (255),
    is_member BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    added TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (255),
    message VARCHAR (255),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    added TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`

async function main() {
    console.log("creating tables");
    const client = new Client({
        connectionString: process.env.DB_CONNECTION_STRING
    })
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();