create_query = (
  'CREATE TABLE IF NOT EXISTS Books ( '
  'id SERIAL PRIMARY KEY, '
  'name VARCHAR, '
  'club VARCHAR, '
  'rating VARCHAR, '
  'img VARCHAR, '
  'href VARCHAR '
  ');')

get_book_list_query = (
  'SELECT * '
  'FROM Books '
  'WHERE club=%s '
  ';')

add_book_query = (
  'INSERT INTO Books (name, club, rating, img, href) '
  'VALUES (%s, %s, %s, %s, %s) '
  ';')