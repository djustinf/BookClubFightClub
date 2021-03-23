import requests
import json
from flask import Flask, request, Response
from flask_cors import CORS
from bs4 import BeautifulSoup
from .daos.dao import create_database_dao, get_book_list_dao, add_book_dao
from .util.club_orchestrator import ClubOrchestrator

app = Flask(__name__)
CORS(app)
create_database_dao()

club_orch = ClubOrchestrator()

@app.route('/get_book_data', methods=['GET'])
def get_book_data():
  good_reads_url = 'https://www.goodreads.com'
  book_name = request.args.get('book_name')

  rec = requests.get('{}/search?q={}'.format(good_reads_url, book_name))
  soup = BeautifulSoup(rec.text, 'html.parser')
  rating = soup.find('span', {'class': 'minirating'}).text.strip()
  img = soup.find('img', {'class': 'bookCover'})['src']
  href = soup.find('a', {'class': 'bookTitle'})['href']

  return json.dumps({
    'rating': str(rating),
    'href': str('{}{}'.format(good_reads_url, href)),
    'img': str(img)
  }), 200

@app.route('/club/<club>/get_book_list', methods=['GET'])
def get_book_list(club):
  books = get_book_list_dao(club)

  return json.dumps({
    'book_list': list(books)
  }), 200

@app.route('/club/<club>/listen', methods=['GET'])
def club_listen(club):
  def stream():
    messages = club_orch.addListener(club)  # returns a queue.Queue
    while True:
      msg = messages.get()  # blocks until a new message arrives
      msg_fmt = f'data: {msg}\n\n'
      yield msg_fmt

  resp = Response(stream(), mimetype='text/event-stream')
  resp.headers['X-Accel-Buffering'] = 'no'

  return resp

@app.route('/club/<club>/add_book', methods=['POST'])
def add_book(club):
  request_data = json.loads(request.get_data())
  name = request_data['name']
  rating = request_data['rating']
  img = request_data['img']
  href = request_data['href']

  result = add_book_dao(name, club, rating, img, href)
  club_orch.announceClub(club, result)

  return result, 200