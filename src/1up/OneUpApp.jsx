import React from 'react';
import Client from './Client';

const fetch = require('node-fetch');

export default class OneUpApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiResponse: undefined,
      accessCode: undefined
    }

    this.handleGetCode = this.handleGetCode.bind(this);
    this.handleGetToken = this.handleGetToken.bind(this);
    this.handleGetEverything = this.handleGetEverything.bind(this);
    this.getCode = this.getCode.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getEverything = this.getEverything.bind(this);
  }

 

  handleGetCode(event) {
    event.preventDefault();
    this.getCode('1');
  }

  handleGetToken(event) {
    event.preventDefault();
    this.getToken(this.state.accessCode);
  }

  handleGetEverything(event) {
    event.preventDefault();
    this.getEverything(this.state.accessToken);
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

  async getEverything(accessCode) {
    const patientId = '1d5e078b47ba'; // TODO get from state
    const response = await fetch('/api/fhir/everything', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `code=${accessCode}&patient_id=${patientId}`
    });

    const json = await response.json();

    console.log('json from express', json);
  }


  async getFhirEverything(accessToken) {
    const patientId = '1d5e078b47ba';
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