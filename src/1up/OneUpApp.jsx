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
  }

  handleClick(event) {
    event.preventDefault();
    // this.getToken('4f53f2cb34724277a61f2bcc11d70d36');
    // this.getFhirAuth('996cd2f6bca74878a7f2bfe658f17597');
    this.getFhirEverything('306341f4490a4b94ac6b1bc8ea8c14f8');
    // this.getCode('1');
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

  async getFhirAuth(accessCode) {
    const response = await fetch(`/api/fhir`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // body: `code=${accessCode}`
      body: `code=996cd2f6bca74878a7f2bfe658f17597`
    });

    const json = await response.json();

    console.log('response from express',);
    console.log('response from express', json);
    // this.setState({apiResponse: JSON.stringify(json)});
  }

  async getFhirEverything(accessCode) {
    const patientId = '1d5e078b47ba';
    const response = await fetch(`/api/fhir/everything`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `code=${accessCode}&patient_id=${patientId}`
    });

    console.log(response);
    const json = await response.json();

    console.log('response from express', json);
    this.setState({apiResponse: JSON.stringify(json)});
  }

  render() {
    return(
      <div id="ui-container">
        1up UI

        <button onClick={this.handleClick}>Get Code</button>
        <div>
          QuickConnect
          <button onClick={this.handleClick}>Connect</button>
        </div>

        <div>
          $everything
          <button onClick={this.handleClick}>Connect</button>
        </div>

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