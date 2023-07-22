## google-places-twilio
A demo on how to use Google Places API and Twilio Whatsapp API to build a place locator


## how to set up project

- Install the packages using the command below
```bash
npm install
```
- Create a `.env` file add the following parameters with their value
```bash
TWILIO_AUTH_TOKEN=
TWILIO_ACCOUNT_SID=
GOOGLE_CLOUD_API=
```
- Start the development server with the following command
```bash
npm start
```

Your application is ready for use and testing on local machine.

## deploying to server for use
To deploy this app, you can follow these steps:
- Create an account on Render and follow this [guide](https://render.com/docs/deploy-node-express-app) to deploying a web service on Render to complete the deployment

OR

- Setup an ngrok server in your machine and proxy the localhost port where this project is running to an ngrok public secured domain.

## testing
- Whatever deployment method used, the public domain gotten at the end can be use to set as the webhook url on Twilio which will trigger the API
whenever a user sends a message through Whatsapp.

- Start the app by sending a message to the Twilio Whatsapp sandbox number (follow [here](https://www.twilio.com/docs/whatsapp/sandbox) to get yours before even setting up the app) and see the magic!
