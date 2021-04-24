import React from 'react';
import BookList from './book-list';

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.setup = this.setup.bind(this);
  }

  setup() {
    const username = document.getElementById('userInput').value;
    const club = document.getElementById('clubInput').value;

    if (!(username && club)) {
      alert('Please enter both your name and a club name!');
    } else {
      this.setState({ user: username, club: club });
    }
  }

  render() {
    return (
      <div className="nes-container with-title">
        <p className="title">BookClubFightClub</p>
        { (this.state.club && this.state.user) ?
          <BookList user={this.state.user} club={this.state.club}></BookList> :
          <div>
            <p>What should I call you?</p><input type='text' className="nes-input" id='userInput'/>
            <p>What club are you joining?</p><input type='text' className="nes-input" id='clubInput'/>
            <button type="button" className="nes-btn is-primary" onClick={this.setup}>Join that book club!</button>
          </div>
        }
      </div>
    )
  }
}