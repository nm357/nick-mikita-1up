import React from 'react';
import Client from './Client';

const fetch = require('node-fetch');

export default class OneUpApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiResponse: undefined
    }

    this.handleClick = this.handleClick.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    // this.getToken('4f53f2cb34724277a61f2bcc11d70d36');
    this.getCode('user_id');
  }

  async getCode(appUserId) {
    const response = await fetch('/api/code', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `app_user_id=${appUserId}`
    });

    const json = await response.json();

    console.log('response from express', json);
    this.setState({apiResponse: JSON.stringify(json)});
  }

  async getToken(accessCode) {
    const response = await fetch(`/api/token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `code=${accessCode}`
    });

    const json = await response.json();

    console.log('response from express',);
    console.log('response from express', json);
    this.setState({apiResponse: JSON.stringify(json)});
  }

  render() {
    return(
      <div id="ui-container">
        1up UI

        <button onClick={this.handleClick}>Get Code</button>
        <div>
          api response:
          <div>
            {this.state && this.state.apiResponse }
          </div>
        </div>
      </div>
    )
  }
}