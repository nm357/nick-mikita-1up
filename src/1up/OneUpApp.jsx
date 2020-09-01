import React from 'react';

const fetch = require('isomorphic-fetch');

export default class OneUpApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiResponse: undefined,
      accessCode: undefined,
      appUserId: 'nick'
    }

    this.handleGetCode = this.handleGetCode.bind(this);
    this.handleGetToken = this.handleGetToken.bind(this);
    this.handleGetEverything = this.handleGetEverything.bind(this);
    this.getCode = this.getCode.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getFhirEverything = this.getFhirEverything.bind(this);
  }

 

  handleGetCode(event) {
    event.preventDefault();
    const appUserId = this.state.appUserId || 'appUserId';
    this.getCode(appUserId);
  }

  handleGetToken(event) {
    event.preventDefault();
    this.getToken(this.state.accessCode);
  }

  handleGetEverything(event) {
    event.preventDefault();
    this.getFhirEverything(this.state.accessToken);
  }

  async getCode(appUserId) {
    const response = await fetch('/api/code', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `app_user_id=${appUserId}`
    });

    const json = await response.json();

    console.log('response from express', json);
    this.setState({
      apiResponse: JSON.stringify(json),
      accessCode: json.code,
      appUserId: json.app_user_id
    });
  }

  async getToken() {
    const response = await fetch(`/api/token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `code=${this.state.accessCode}`
    });

    const json = await response.json();

    console.log('response from express', json);
    this.setState({
      apiResponse: JSON.stringify(json),
      accessToken: json.access_token
    });
  }

  async getFhirEverything(accessToken) {
    const patientId = '2515025074d8'; // TODO get from QuickConnect Api?
    const response = await fetch(`/api/fhir/everything`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `access_token=${accessToken}&patient_id=${patientId}`
    });

    const json = await response.json();

    console.log('response from express', json);
    this.setState({apiResponse: JSON.stringify(json)});
  }

  render() {
    return(
      <div id="ui-container">
        1up UI

        <button onClick={this.handleGetCode}>Get Code</button>
        <button onClick={this.handleGetToken}>Then Get Token</button>
        <button onClick={this.handleGetEverything}>Then Get Everything</button>

        <div>
          <a target="_blank" rel="noopener noreferrer" href={`https://quick.1up.health/connect/4706?access_token=${this.state.accessToken}`}>Connect with Token</a>
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