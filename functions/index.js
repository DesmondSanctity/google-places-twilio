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
    console.log(message)

    if (message.Longitude && message.Latitude) {
        return {
            lat: message.Latitude,
            long: message.Longitude
        };
    }

    return null;
}

// Get query text from message 
export function getQuery(message) {

    return message.Body;
}

// Search Places API
export async function searchPlaces(query, location) {

    console.log(location)

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.long}&radius=3000&keyword=${query}&key=${googlePlacesKey}`

    const response = await axios.get(url);
    const places = response.data.results;
    console.log(url)
    console.log(places)
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