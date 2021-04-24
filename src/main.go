package main

import (
	"github.com/djustinf/BookClubFightClub/db"
	"github.com/djustinf/BookClubFightClub/server"
)

func main() {
	dbPool := db.GetDBPool()
	defer dbPool.Close()
	db.CreateDatabaseDao()

	// Will only be necessary on switching to long-polling/WebSockets
	// rdb := db.GetRDB()
	// defer rdb.Close()

	e := server.GetServer()

	e.Logger.Fatal(e.Start(":8081"))
}
