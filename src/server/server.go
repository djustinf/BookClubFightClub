package server

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/djustinf/BookClubFightClub/db"
	"github.com/djustinf/BookClubFightClub/types"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var e *echo.Echo

func GetServer() *echo.Echo {
	if e != nil {
		return e
	}

	e = echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.DefaultCORSConfig))

	// Routes
	e.GET("/get_book_data", getBookData)
	e.GET("/club/:club/get_book_list", getBookList)
	e.POST("/club/:club/add_book", addBook)
	e.POST("/club/:club/remove_book", removeBook)

	return e
}

func getBookData(c echo.Context) error {
	name := c.FormValue("book_name")
	gr := "https://www.goodreads.com"
	grURL, _ := url.Parse(fmt.Sprintf("%s/search", gr))

	params := url.Values{}
	params.Add("q", name)

	grURL.RawQuery = params.Encode()

	res, err := http.Get(grURL.String())
	if err != nil {
		log.Fatal(err)
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	// Load the HTML document
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	rating := strings.TrimSpace(doc.Find(".minirating").First().Text())
	hrefURL, _ := url.Parse(gr + strings.TrimSpace(doc.Find(".bookTitle").First().AttrOr("href", "")))
	imgURL, _ := url.Parse(strings.TrimSpace(doc.Find(".bookCover").First().AttrOr("src", "")))

	// Find the stuff
	data := &types.BookData{
		Rating: rating,
		Href:   hrefURL.String(),
		Img:    imgURL.String(),
		Name:   name,
	}

	return c.JSON(http.StatusOK, data)
}

func getBookList(c echo.Context) error {
	club := c.Param("club")
	bl := &types.BookList{
		BookList: db.GetBookListDao(c, club),
	}
	return c.JSON(http.StatusOK, bl)
}

func addBook(c echo.Context) error {
	m := echo.Map{}
	c.Bind(&m)

	book := &types.BookData{
		Club:   c.Param("club"),
		Name:   m["name"].(string),
		Rating: m["rating"].(string),
		Img:    m["img"].(string),
		Href:   m["href"].(string),
	}

	db.AddBookDao(c, book)

	return c.JSON(http.StatusOK, book)
}

func removeBook(c echo.Context) error {
	m := echo.Map{}
	c.Bind(&m)

	book := &types.BookData{
		Club:   c.Param("club"),
		Name:   m["name"].(string),
		Rating: m["rating"].(string),
		Img:    m["img"].(string),
		Href:   m["href"].(string),
	}

	db.RemoveBookDao(c, book)

	return c.JSON(http.StatusOK, book)
}
