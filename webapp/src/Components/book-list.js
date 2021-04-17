import React from 'react';
import axios from 'axios';
import Book from './book';

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
    this.updateBooks = this.updateBooks.bind(this);
  }

  componentDidMount() {
    // replace this with long-polling, WebSockets, or SSEs in the future
    this.updateBooks();
  }

  updateBooks() {
    axios.get(`http://localhost:8080/go/club/${this.state.club}/get_book_list`)
    .then(res => {
      const book_list = res.data?.book_list;
      if (book_list) {
        const books = book_list.map(book => ({ name: book.name, rating: book.rating, href: book.href, img: book.img }));
        // this may cause a book you just added to vanish for a bit... that should probably be fixed :)
        this.setState({ books });
      }
    },
    err => console.log(err));

    setTimeout(this.updateBooks, 3000);
  }

  addBook() {
    const book = document.getElementById('bookInput').value;

    if (book) {
      axios.get('http://localhost:8080/go/get_book_data', { params: { book_name: book }})
      .then(res => {
          const rating = res.data.rating;
          const href = res.data.href;
          const img = res.data.img;

          const new_book = { name: book, rating, href, img };

          this.setState({ books: [...this.state.books, new_book] });

          axios.post(`http://localhost:8080/go/club/${this.state.club}/add_book`, new_book)
          .then(res => {
            console.log('Successfully sent book!');
          },
          err => console.log(err));
      },
      err => console.log(err));
    }
  }

  removeBook(name) {
    const book = this.state.books.find(e => e.name === name);
    const books = this.state.books.filter(e => e.name !== name);

    this.setState({ books });

    if (book) {
      axios.post(`http://localhost:8080/go/club/${this.state.club}/remove_book`, book)
      .then(res => {
        console.log('Successfully sent book!');
      },
      err => console.log(err));
    }
  }

  render() {
    return (
      <div>
        {this.state.books.map((book) => (<Book key={book.name} book={book} remove={this.removeBook}></Book>))}
        <input type='text' className="nes-input" id='bookInput'/>
        <button type="button" className="nes-btn is-primary" onClick={this.addBook}>Add Book</button>
      </div>
    )
  }
}