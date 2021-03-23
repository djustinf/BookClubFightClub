import psycopg2
from .queries import create_query, get_book_list_query, add_book_query
from .transforms import book_to_json

def create_database_dao():
  db_con = psycopg2.connect(host='postgres', database='books', user='postgres', password='postgres')
  cur = db_con.cursor()

  cur.execute(create_query)
  db_con.commit()

  cur.close()
  db_con.close()

def get_book_list_dao(club):
  db_con = psycopg2.connect(host='postgres', database='books', user='postgres', password='postgres')
  cur = db_con.cursor()

  cur.execute(get_book_list_query, [club])
  results = cur.fetchall()

  cur.close()
  db_con.close()

  return map(book_to_json, results)

def add_book_dao(name, club, rating, img, href):
  db_con = psycopg2.connect(host='postgres', database='books', user='postgres', password='postgres')
  cur = db_con.cursor()

  cur.execute(add_book_query, [name, club, rating, img, href])
  db_con.commit()

  cur.close()
  db_con.close()

  # id value is ignored by transform
  print(book_to_json((0, name, club, rating, img, href)))
  return book_to_json((0, name, club, rating, img, href))