import twilio from 'twilio';

import dotenv from 'dotenv'


dotenv.config()

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Set up Twilio client
const twilioClient = twilio(accountSid, authToken);

// Google Places API url and key
const placesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const googlePlacesKey = process.env.GOOGLE_API;

// Variables to store location and query
let location;
let query;

// Send initial prompt for location
twilioClient.messages.create({
    body: 'Please send your location',
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: 'whatsapp:+1234567890'
})

// Receive WhatsApp message
twilioClient.messages.get('messageSid')
    .then(message => {
        // If message contains location media, save it
        if (message.numMedia > 0) {
            location = message.media[0];

            // Now prompt for query
            return twilioClient.messages.create({
                body: 'Thanks, got your location! Now please send your query text',
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: 'whatsapp:+1234567890'
            })
        }
    })

// Get text query message
twilioClient.messages.get('messageSid')
    .then(message => {
        // If message is text, save query
        if (message.body) {
            query = message.body;

            // Now we have location and query, call Places API
            callPlacesAPI(query, location);
        }
    })


async function callPlacesAPI(query, location) {

    // Construct request url
    const url = `${placesUrl}?keyword=${query}&location=${location}&radius=5000&key=${googlePlacesKey}`;

    try {
        // Make API request with axios
        const response = await axios.get(url);

        // Get places from response 
        const places = response.data.results;

        // Build and send WhatsApp response
        let msg = `Found these places near you for ${query}:`;
        places.forEach(place => {
            msg += `\n- ${place.name}`
        });

        client.messages.create({
            body: msg,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: 'whatsapp:+1234567890'
        });

    } catch (error) {
        console.log(error);
    }

}