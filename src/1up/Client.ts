/**
* The 1upHealth FHIR ​$everything​query retrieves all electronic health record (EHR) 
* information for a patient that has been authorized for use by 1upHealth. 
* Results are returned as a paginated JSON-formatted FHIR “bundle” resource.
*
* Your task is to design and implement a web application that uses the 1upHealth API 
* to access test patient data using the FHIR ​$everything​query for a test user from 
* an Electronic Health Record (EHR) vendor. 
* 
* The application should accept an access token 
* and return the results of the ​$everything ​query in a human-readable format. 
* Note you don’t need to spend too much time on styling or visuals for the data, 
* just make sure it’s human-readable.

● Create a React.js web-based client application for the user interface
● Store the results of the ​$everything​query in your own SQL or noSQL database and
retrieve the results of recent API calls on demand
● Deploy your solution to a publicly accessible web page
 */

import User from './User';

const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const URL = {
  Api: 'https://api.1up.health/',
  User_Mgmt: 'user-management/v1/user',
  Token_Mgmt: 'fhir/oauth2/token'
};

export default class Client {
  private readonly creds: ClientCredentials;

  constructor(creds: ClientCredentials) {
    this.creds = creds;
  }

  private appendCredentials(params: URLSearchParams): URLSearchParams {
    params.append('client_id', this.creds.id);
    params.append('client_secret', this.creds.secret);

    return params;
  }

  async createUser(appUserId: string | number) {
    try {
      const reqBody = `client_id=${this.creds.id}&client_secret=${this.creds.secret}&app_user_id=${appUserId}`;
      
      const response = await fetch(`${URL.Api}${URL.User_Mgmt}`, { 
        method: 'post',
        body: reqBody,
        mode: 'no-cors',
        headers: {'Access-Control-Allow-Origin': '*'}
      });

      console.log('user response: ', response);
  
      if (response && response.success) {
        return new User(response.app_user_id, response.code);
      } else {
        return {
          msg: 'Error creating user',
          err: `${response}`
        };
      }
    } catch (err) {
      console.log('caught: ', err);
    }
  }

  async getTokens(grantType: string = 'authorization_code', accessCode?: string, refreshToken?: string) {
    const params = this.appendCredentials(new URLSearchParams());
    params.append('grant_type', grantType);
    if (accessCode) params.append('code', accessCode);
    if (refreshToken) params.append('refresh_token', refreshToken);

    const response = await fetch(`${URL.Api}${URL.Token_Mgmt}`, { method: 'post', body: params, mode: 'no-cors' })
      
    if (response && !response.error) {
      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };
    } else {
      return {
        msg: 'Error getting acess token',
        err: `${response}`
      };
    }
  }

  async refreshTokens(refreshToken: string) {
   return this.getTokens('refresh_token', undefined, refreshToken);
  }
}

type ClientCredentials = {
  id: string,
  secret: string
}

