import React from 'react';
import Client from './Client';

export default class OneUpApp extends React.Component {
  private readonly apiClient: Client = new Client({id: '', secret: ''});

  constructor(props: any) {
    super(props);

    this.state = {
      apiResponse: undefined
    }

    this.handleCreateUser = this.handleCreateUser.bind(this);
  }
  
  async handleCreateUser(event: any) {
    event.preventDefault();
    this.setState({ apiResponse: await this.apiClient.createUser('') });
  }

  render() {
    return(
      <div id="ui-container">
        1up UI

        <button onClick={this.handleCreateUser}>Create User</button>

        <div>
          api response:
        </div>
      </div>
    )
  }
}