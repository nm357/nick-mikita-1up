const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fetch = require('isomorphic-fetch');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);

const client_id = process.env.CLIENT_ID || 'id';
const client_secret = process.env.CLIENT_SECRET || 'id';

app.post('/api/code', async (req, res) => {
  const appUserId = req.body.appUserId;
  const url = `https://api.1up.health/user-management/v1/user/auth-code?app_user_id=${appUserId}&client_id=${client_id}&client_secret=${client_secret}`;
  const apiResonse = await fetch(url, { method: 'POST' })
    .then(res => res.json())
    .then(json => { 
      console.log('json response from 1up', json);
      return json 
    })
    .catch(err => res.send(`Error in express fetch: ${err}`));

    res.send(apiResonse);
});

app.post('/api/token', async (req, res) => {
  console.log('body: ', req.body);
  const code = req.body.code || 'accessCode';
  console.log('code in server: ', code);

  res.setHeader('Content-Type', 'application/json');
  const postUrl = `https://api.1up.health/fhir/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;
  console.log('url: ', postUrl);
  
  const apiResonse = await fetch(postUrl, { method: 'POST' })
    .then(res => res.json())
    .then(json => { 
      console.log('json response from 1up', json);
      return json 
    })
    .catch(err => res.send(`Error in express fetch: ${err}`));

   res.send(apiResonse);
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);