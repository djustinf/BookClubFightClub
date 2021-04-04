package types

type BookData struct {
	Name   string `json:"name"`
	Club   string `json:"club"`
	Rating string `json:"rating"`
	Href   string `json:"href"`
	Img    string `json:"img"`
}

type BookList struct {
	BookList []BookData `json:"book_list"`
}
