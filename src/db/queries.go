package db

/*
 * Books Queries
 */
const createBooksQuery = `CREATE TABLE IF NOT EXISTS Books (
	id SERIAL PRIMARY KEY,
  name VARCHAR,
  club VARCHAR,
  rating VARCHAR,
  img VARCHAR,
  href VARCHAR,
  CONSTRAINT diff_books UNIQUE (name, club)
  );`

const getBookListQuery = `SELECT * FROM Books
  WHERE club=$1
  ;`

const deleteBookQuery = `DELETE FROM Books
  WHERE club=$1 AND name=$2
  ;`

const addBookQuery = `INSERT INTO Books (name, club, rating, img, href)
  VALUES ($1, $2, $3, $4, $5)
  ;`

/*
 * Votes Queries
 */
const createVotesQuery = `CREATE TABLE IF NOT EXISTS Votes (
	id SERIAL PRIMARY KEY,
  name VARCHAR,
  club VARCHAR,
  vote VARCHAR,
  CONSTRAINT diff_names UNIQUE (name, club),
  CONSTRAINT legit_votes FOREIGN KEY (vote, club)
    REFERENCES Books (name, club)
    ON DELETE CASCADE
  );`

const addVoteQuery = `INSERT INTO Votes (name, club, vote)
  VALUES ($1, $2, $3)
  ON CONFLICT ON CONSTRAINT diff_names DO UPDATE SET vote=EXCLUDED.vote
  ;`

const removeVoteQuery = `DELETE FROM Votes
  WHERE club=$1 AND name=$2
  ;`

const getVoteListQuery = `SELECT * FROM Votes
  WHERE club=$1
  ;`
