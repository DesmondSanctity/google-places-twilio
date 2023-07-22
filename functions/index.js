import twilio from 'twilio';
import axios from 'axios';

import dotenv from 'dotenv'


dotenv.config()

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Set up Twilio client
const twilioClient = twilio(accountSid, authToken);

// Google Places API key
const googlePlacesKey = process.env.GOOGLE_CLOUD_API;



// Get location from message
export function getLocation(message) {

    if (message.numMedia > 0) {
        return message.MediaUrl0;
    }

    return null;
}

// Get query text from message 
export function getQuery(message) {

    return message.Body;
}

// Search Places API
export async function searchPlaces(query, location) {

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.Latitude},${location.Longitude}&radius=500&keyword=${query}&key=${googlePlacesKey}`

    const response = await axios.get(url);
    const places = response.data.results;
    return places.map(place => place.geometry.location);

}

// Send WhatsApp message via Twilio
export function sendMessage(body, recipient) {

    return twilioClient.messages.create({
        body: body,
        from: recipient.To,
        to: recipient.From,
    });
}