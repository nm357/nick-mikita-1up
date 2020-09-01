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
    this.getEverything(this.state.accessCode);
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

  componentDidMount() {
    console.log('init state', this.state);
  }

  componentDidUpdate() {
    console.log('updated state', this.state);
  }

  render() {
    console.log('state', this.state);
    return(
      <div id="ui-container">
        1up UI

        <button onClick={this.handleGetCode}>Get Code</button>
        <button onClick={this.handleGetToken}>Then Get Token</button>
        <button onClick={this.handleGetEverything}>Then Get Everything</button>
        {/* <div>
          QuickConnect
          <button onClick={this.handleClick}>Connect</button>
        </div>

        <div>
          $everything
          <button onClick={this.handleClick}>Connect</button>
        </div> */}

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