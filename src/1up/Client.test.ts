import Client from './Client';
import User from './User';

const id = '';
const secret = '';

xtest('gets an access token for app user', async () => {
  // TODO mock api responses
  const { accessToken, refreshToken } = await new Client({id, secret}).getTokens('access_code');
  expect(accessToken);
  expect(refreshToken);
});

xtest('refreshes access token', async () => {
  // TODO mock api responses
  const { accessToken, refreshToken } = await new Client({id, secret}).refreshTokens('refresh_token');
  expect(accessToken);
  expect(refreshToken);
});

xtest('creates a user with given id', async () => {
  const response = await new Client({id, secret}).createUser('user_id'); //numeric string?
  expect(response);
  const user: User = JSON.parse(JSON.stringify(response));
  expect(user);
})