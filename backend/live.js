const { google } = require('googleapis');
const youtube = google.youtube('v3');
const fs = require('fs');

const getLiveStatus = async () => {

  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
  });

  const jwtinputraw = fs.readFileSync('./jwtinput.json');
  const jwtinput = JSON.parse(jwtinputraw);
  const authClient = await auth.fromJSON(jwtinput);


  const lbs = await youtube.liveBroadcasts.list({
    auth: authClient,
    broadcastStatus: 'active',
    part: 'status',
  });
  cosole.info(lbs.data);
}

module.exports = { getLiveStatus }