package db

import (
	"context"
	"log"

	"github.com/djustinf/BookClubFightClub/types"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/labstack/echo/v4"
)

var dbPool *pgxpool.Pool

func GetDBPool() *pgxpool.Pool {
	if dbPool != nil {
		return dbPool
	}

	// set this up as an env var
	pool, err := pgxpool.Connect(context.Background(), "postgresql://postgres:postgres@postgres:5432/books")
	if err != nil {
		log.Fatal("DB failed to connect.")
	}

	dbPool = pool

	return dbPool
}

func CreateDatabaseDao(c echo.Context) {
	GetDBPool().Exec(c.Request().Context(), createQuery)
}

func GetBookListDao(c echo.Context, club string) []types.BookData {
	rows, _ := GetDBPool().Query(c.Request().Context(), getBookListQuery, club)
	defer rows.Close()

	var books []types.BookData
	for rows.Next() {
		columns, _ := rows.Values()
		data := &types.BookData{
			// skip id columns[0]
			Name:   columns[1].(string),
			Club:   columns[2].(string),
			Rating: columns[3].(string),
			Img:    columns[4].(string),
			Href:   columns[5].(string),
		}
		books = append(books, *data)
	}
	return books
}

func AddBookDao(c echo.Context, b *types.BookData) {
	GetDBPool().Exec(c.Request().Context(), addBookQuery, b.Name, b.Club, b.Rating, b.Img, b.Href)
}

func RemoveBookDao(c echo.Context, b *types.BookData) {
	GetDBPool().Exec(c.Request().Context(), deleteBookQuery, b.Club, b.Name)
}
