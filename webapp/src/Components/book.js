import React from 'react';

export default class Book extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.book.name,
      href: props.book.href,
      rating: props.book.rating,
      img: props.book.img,
    };

    this.removeBook = this.props.remove.bind(this);
  }

  render() {
    return (
      <div className="nes-container is-rounded">
        <a href={this.state.href} target='_blank' rel='noreferrer'>{this.state.name}</a> - {this.state.rating} - <img src={this.state.img} alt='Oof owie ouch my bones'/><button type="button" className="nes-btn is-error remove-button" onClick={() => this.removeBook(this.state.name)}>X</button>
      </div>
    )
  }
}