const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fetch = require('isomorphic-fetch');

const { getAllFhirResourceBundles } = require('../src/1up/oneup');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);

const PORT = 8000;
const client_id = process.env.CLIENT_ID || 'id';
const client_secret = process.env.CLIENT_SECRET || 'id';

const token_url = 'https://api.1up.health/fhir/oauth2/token'; 
const api_url = 'https://api.1up.health/fhir';  
const scope = 'user/*.*';

let auth = {
  code: undefined,
  access_token: undefined,
  refresh_token: undefined
};

app.get('/', async (req, res) => {
  console.log('got 8000/');
  console.log(req);
})

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

// FHIR Api $everything query
// To query everything simply hit this endpoint with the patient's id, fhir version type (dstu2/stu3/r4) and their bearer access token.

// curl -X GET 'https://api.1up.health/fhir/{fhirVersion}/Patient/{patient_id}/$everything' \
//   -H "Authorization: Bearer accesstokenaccesstoken"

app.post('/api/fhir', async (req, res) => {
  const system_id = '​4706'; // Epic demo
  // const access_token = '996cd2f6bca74878a7f2bfe658f17597';
  const access_token = req.body.code || 'accessCode';
  console.log('auth: ', auth);
  // const url = `${api_url}/${system_id}?access_token=${access_token}`;
  const url = 'https://quick.1up.health/connect/4706?access_token=996cd2f6bca74878a7f2bfe658f17597'

  // redirect gives url params
  const apiResonse = await fetch(url, { method: 'GET' })
    .then(res => {
      console.log('res', res);
      return res;
    })
    // .then(res => res.json())
    // .then(json => { 
    //   console.log('json response from 1up', json);
    //   return json 
    // })
    .catch(err => res.send(`Error in express fetch: ${err}`));
  
  res.send(apiResonse);
});

app.post('/api/fhir/everything', async (req, res) => {
  console.log('$everything');
  const access_token = req.body.code || 'accessCode';
  const patient_id = req.body.patient_id || 'patientId';
  const fhirVersion = 'DSTU2';
  const url = `https://api.1up.health/fhir/${fhirVersion}/Patient/${patient_id}/$everything`

  try {
    // const apiResponse = await fetch(url, { method: 'GET', headers: {'Authorization': `Bearer ${access_token}`} })
    //   .then(res => { console.log(res); })
    //   .then(res => res.json)
    //   .then(json => json)
    //   .catch(err => console.log('err', err));
  
      const bundles = await new Promise((res, rej) => {
        getAllFhirResourceBundles(access_token, (data) => res(data));
      }).then(data => data); 
  
      console.log('bundles', bundles);
  
      // res.send(apiResonse);
      res.send(bundles);
  } catch (error) {
    res.send({error});
  }
});

app.listen(PORT, () =>
  console.log('Express server is running on localhost:', PORT)
);