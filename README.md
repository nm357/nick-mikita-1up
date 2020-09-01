# Hello 1upHealth Team!

This repo holds a simple React web-app that connects with an expressJS server to make requests against the 1upHealth APIs.

Configure for local running:
* Clone this repo

* run "npm install"

* Create a .env file in the project root, including "CLIENT_ID=..." and "CLIENT_SECRET=..." with the appropriate values.

* To run both the React app and express server, use "npm run dev"

## React App:
All the action happens in src/1up/OneUpApp.jsx.
I started with "Client.ts" but due to linting/compiling fun, decided to switch over to the jsx file and simplify.

I have hard-coded an app_user_id into my app (made via both the Postman Collection &&  the now unused "src/1up/Client.ts") to init the code>token flow, as well as a patientId for the $everything query, as I have not yet been able to configure the redirect from the QuickConnect API

Click the buttons in sequence to get a code, then an access token, then get everything (empy bundles returned for me, at this point). Clicking the "Connect with Token" link after getting an access token will direct to the Epic Demo QuickConnect login screen (still troubleshooting the redirect).

API responses will be displayed as plain text in a div, and also are logged to the dev console.


## Express Server:
All the action happens in server/index.js.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
