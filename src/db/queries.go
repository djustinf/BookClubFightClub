package db

const createQuery = `CREATE TABLE IF NOT EXISTS Books (
	id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE,
  club VARCHAR,
  rating VARCHAR,
  img VARCHAR,
  href VARCHAR
  );`

const getBookListQuery = `SELECT * 
  FROM Books
  WHERE club=$1
  ;`

const deleteBookQuery = `DELETE
  FROM Books
  WHERE club=$1 AND name=$2
  ;`

const addBookQuery = `INSERT INTO Books (name, club, rating, img, href)
  VALUES ($1, $2, $3, $4, $5)
  ;`
