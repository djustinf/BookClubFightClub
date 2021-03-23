import json

# (id, name, club, rating, img, href)
def book_to_json(book):
  return json.dumps({
    'name': str(book[1]),
    'club': str(book[2]),
    'rating': str(book[3]),
    'img': str(book[4]),
    'href': str(book[5])
  })