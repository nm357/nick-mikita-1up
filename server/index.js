const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fetch = require('isomorphic-fetch');

const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);

const PORT = 8000;
const client_app_url = 'http://localhost:3000';
const client_id = process.env.CLIENT_ID || 'id';
const client_secret = process.env.CLIENT_SECRET || 'id';

const token_url = 'https://api.1up.health/fhir/oauth2/token'; 
const api_url = 'https://api.1up.health/fhir';  
const scope = 'user/*.*';

// TODO handle refreshing tokens
const auth = {
  code: undefined,
  access_token: undefined,
  refresh_token: undefined
};

app.get('/', async (req, res) => {
  console.log(req.query);
  console.log(req.url);
  if (req.query.success === 'false') {
    console.log('auth redirect indicated failure');
  } else {
    console.log('auth redirect indicated success');
  }
  res.redirect(`${client_app_url}${req.url}`);
});

app.post('/api/code', async (req, res) => {
  const appUserId = req.body.app_user_id;
  const url = `https://api.1up.health/user-management/v1/user/auth-code?app_user_id=${appUserId}&client_id=${client_id}&client_secret=${client_secret}`;
  const apiResonse = await fetch(url, { method: 'POST' })
    .then(res => res.json())
    .then(json => { 
      auth.code = json.code;
      return json 
    })
    .catch(err => res.send(`Error in express fetch: ${err}`));

    res.send(apiResonse);
});

app.post('/api/token', async (req, res) => {
  console.log('auth', auth);
  const code = req.body.code || 'accessCode';
  const postUrl = `${token_url}?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;
  
  const apiResonse = await fetch(postUrl, { method: 'POST' })
    .then(res => res.json())
    .then(json => { 
      auth.access_token = json.access_token;
      auth.refresh_token = json.refresh_token;
      return json 
    })
    .catch(err => res.send(`Error in express fetch: ${err}`));

  res.send(apiResonse);
});

/**
 * From Docs:
 * FHIR Api $everything query
 * To query everything simply hit this endpoint with the patient's id, fhir version type (dstu2/stu3/r4) and their bearer access token.
 * curl -X GET 'https://api.1up.health/fhir/{fhirVersion}/Patient/{patient_id}/$everything' \
 *  -H "Authorization: Bearer accesstokenaccesstoken"
 */
app.post('/api/fhir/everything', async (req, res) => {
  const access_token = req.body.access_token || 'accessCode';
  const patient_id = req.body.patient_id || 'patientId';
  const fhirVersion = req.body.fhirVersion || 'DSTU2';

  const url = `${api_url}/${fhirVersion}/Patient/${patient_id}/$everything`

  try {
    const reqOptions = {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'credentials': 'include'
      }
    };
    
    const apiResponse = await fetch(url, reqOptions)
      .then(res => res.json())
      .then(json => json)
      .catch(err => err);
  
    res.send(apiResponse);
  } catch (error) {
    console.log('error getting $everything', error);
    res.send({error: JSON.stringify(error)});
  }
});

app.listen(PORT, () =>
  console.log('Express server is running on localhost:', PORT)
);