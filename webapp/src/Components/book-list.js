import React from 'react';
import axios from 'axios';
import Book from './book';

export default class BookList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: {},
      votes: [],
    };

    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.updateBooks = this.updateBooks.bind(this);

    this.addVote = this.addVote.bind(this);
    this.addRandomVote = this.addRandomVote.bind(this);
    this.updateVotes= this.updateVotes.bind(this);
  }

  componentDidMount() {
    // Replace this with long-polling, WebSockets, or SSEs in the future
    this.updateBooks();
    this.updateVotes();
  }

  updateVotes() {
    axios.get(`http://localhost:8080/go/club/${this.props.club}/get_vote_list`)
    .then(res => {
      const votes = res.data?.vote_list;
      if (votes) {
        // This may cause a vote you just added to vanish for a bit... that should probably be fixed :)
        this.setState({ votes });
      }
    },
    err => console.log(err));

    setTimeout(this.updateVotes, 3000);
  }

  updateBooks() {
    axios.get(`http://localhost:8080/go/club/${this.props.club}/get_book_list`)
    .then(res => {
      const book_list = res.data?.book_list;
      if (book_list) {
        const books = book_list.reduce((result, book) => {
          result[book.name] = { name: book.name, rating: book.rating, href: book.href, img: book.img };
          return result;
        },
        {});
          
        // This may cause a book you just added to vanish for a bit... that should probably be fixed :)
        this.setState({ books });
      }
    },
    err => console.log(err));

    setTimeout(this.updateBooks, 3000);
  }

  addVote(name) {
    const vote = { name: this.props.user, vote: name };

    // We want to replace existing vote for this user if one is present
    const votes = this.state.votes.filter((v) => v.name !== this.props.user);
    votes.push(vote)

    this.setState({ votes });

    axios.post(`http://localhost:8080/go/club/${this.props.club}/add_vote`, vote)
    .then(res => {
      console.log('Successfully sent vote!');
    },
    err => console.log(err));
  }

  addRandomVote() {
    const keys = Object.keys(this.state.books);
    const choice = this.state.books[keys[Math.floor(keys.length * Math.random())]];
    this.addVote(choice.name);
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
          
          const books = this.state.books;
          books[book] = new_book;

          this.setState({ books });

          axios.post(`http://localhost:8080/go/club/${this.props.club}/add_book`, new_book)
          .then(res => {
            console.log('Successfully sent book!');
          },
          err => console.log(err));
      },
      err => console.log(err));
    }
  }

  removeBook(name) {
    const book = this.state.books[name];
    const books = this.state.books;

    delete books[name];

    this.setState({ books });

    if (book) {
      axios.post(`http://localhost:8080/go/club/${this.props.club}/remove_book`, book)
      .then(res => {
        console.log('Successfully sent book!');
      },
      err => console.log(err));
    }
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.books).map((key) => (<Book
                                                       key={key}
                                                       book={this.state.books[key]}
                                                       remove={this.removeBook}
                                                       votes={this.state.votes}
                                                       addVote={this.addVote}>
                                                     </Book>))}
        <input type='text' className="nes-input" id='bookInput'/>
        <button type="button" className="nes-btn is-primary" onClick={this.addBook}>Add Book</button>
        <button type="button" className="nes-btn is-warning" onClick={this.addRandomVote}>I'm a coward</button>
      </div>
    )
  }
}