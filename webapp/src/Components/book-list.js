import React from 'react';
import axios from 'axios';

export default class BookList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      username: props.info.username,
      club: props.info.club
    };

    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
  }

  componentDidMount() {
    const sse = new EventSource(`http://localhost:8080/flask/club/${this.state.club}/listen`);
    
    sse.onmessage = (msg) => {
      const book = JSON.parse(msg.data);

      this.setState({ books: [...this.state.books, book] });
    };

    this.setState({ sse });
  }

  componentWillUnmount() {
    this.state.sse.close();
  }

  addBook() {
    const book = document.getElementById('bookInput').value;

    if (book) {
      axios.get('http://localhost:8080/flask/get_book_data', { params: { book_name: book }})
      .then(res => {
          const rating = res.data.rating;
          const href = res.data.href;
          const img = res.data.img;

          const new_book = { name: book, rating, href, img };

          axios.post(`http://localhost:8080/flask/club/${this.state.club}/add_book`, new_book)
          .then(res => {
            console.log('Successfully sent book!');
          },
          err => console.log(err));
      },
      err => console.log(err));
    }
  }

  removeBook() {
    const books = this.state.books;
    books.pop();
    this.setState({ books });
  }

  render() {
    return (
      <div>
        <ul className="nes-list is-disc">
          {this.state.books.map((book, index) => {
            return (
              <li key={index}>
                <a href={book.href} target='_blank' rel='noreferrer'>{book.name}</a> - {book.rating} - <img src={book.img} alt='Oof owie ouch my bones'/>
              </li>
            )
          })}
        </ul>
        <input type='text' className="nes-input" id='bookInput'/>
        <button type="button" className="nes-btn is-primary" onClick={this.addBook}>Add Book</button>
        <button type="button" className="nes-btn is-error" onClick={this.removeBook}>Remove Book</button>
      </div>
    )
  }
}