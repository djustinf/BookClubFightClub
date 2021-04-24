import React from 'react';

export default class Book extends React.Component {
  constructor(props) {
    super(props);

    this.removeBook = props.remove.bind(this);
    this.addVote = props.addVote.bind(this);
  }

  render() {
    const book_votes = this.props.votes.filter((vote) => vote.vote === this.props.book.name);

    return (
      <div className="nes-container is-rounded" onClick={() => this.addVote(this.props.book.name)}>
        <a href={this.props.book.href} target='_blank' rel='noreferrer'>{this.props.book.name}</a> - {this.props.book.rating} - <img src={this.props.book.img} alt='Oof owie ouch my bones'/><button type="button" className="nes-btn is-error remove-button" onClick={() => this.removeBook(this.props.book.name)}>X</button>
        <progress class="nes-progress is-primary" value={!this.props.votes.length ? 0 : (book_votes.length / this.props.votes.length) * 100} max="100"></progress>
      </div>
    )
  }
}