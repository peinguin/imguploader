DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS tags CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  facebook INTEGER DEFAULT null
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY NOT NULL,
  url character varying(255) NOT NULL,
  user_id INTEGER NOT NULL references users(id),
  datetime timestamp with time zone DEFAULT current_timestamp
);
CREATE TABLE tags (
  id SERIAL PRIMARY KEY NOT NULL  UNIQUE ,
  name character varying(255) NOT NULL ,
  image_id INTEGER NOT NULL references images(id)
);

INSERT INTO "users" VALUES(1,'test','test',NULL);
