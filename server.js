import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv'

import { sendMessage, searchPlaces, getLocation, getQuery } from './functions/index.js';


dotenv.config()

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));



// Handle incoming messages
app.post('/chat', async (req, res) => {

  req.session = req.session || {}; // Initialize if undefined

  let query;
  let location;

  // First message
  if(!req.session.state) {
    sendMessage('Hi there! Can you share your location?', req.body);
    req.session.state = 'LOCATION';

  // Got location  
  } else if (req.session.state === 'LOCATION') {
    location = getLocation(req.body);
    sendMessage('Thanks! What place are you looking for?', req.body);
    req.session.state = 'QUERY';
  
  // Got query
  } else if(req.session.state === 'QUERY') {
    query = getQuery(req.body);
    const places = await searchPlaces(query, location); 
    sendMessage(`Here are places near you for ${query}:` + places, req.body);
    req.session.state = 'DONE';
  
  // Reset
  } else if (req.session.state === 'DONE') {
    req.session.query = null; 
    req.session.state = null;
    sendMessage('Thanks for using our service! Send any message to start again.', req.body);

  }
  
  res.sendStatus(200);
});

// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
