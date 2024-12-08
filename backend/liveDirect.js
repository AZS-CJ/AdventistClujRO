const undici = require('undici');
const htmlParser = require('node-html-parser');

// Keep the value in a cache object, so that we don't ask Youtube
// each time an api call comes in
const cache = {
  // The last time is initialized with 1.1.1970
  lastDateTimeQuery: new Date(0),

  // We consider the default value to be false
  isLive: false,

  // We check the live status maximum one time per minute
  intervalForChecking: 60000 // ms
};

// The unique promise is needed so that concurrent api calls
// do no trigger multiple youtube queries. One query is enough.
var uniquePromise = null;

// The 'magic' query happens here where we get the youtube page
// as plain html. If the live is on then the canonical link is different.
const queryYoutube = async (youtubeLiveLink) => {

  const API_KEY = 'AIzaSyDnLbLiWPjlw5CyaaFVjjpmEaP8IVLJJv8';
  const CHANNEL_ID = 'AdventistCluj';

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;

  try {
    const { statusCode, body } = await request(url);

    if (statusCode !== 200) {
      console.error(`API request failed with status: ${statusCode}`);
      return;
    }

    const data = await body.json();

    if (data.items && data.items.length > 0) {
      console.log('The channel is live!');
      data.items.forEach(item => {
        console.log(`Title: ${item.snippet.title}`);
        console.log(`Video ID: ${item.id.videoId}`);
      });
    } else {
      console.log('The channel is not live.');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

const getLiveStatus = async (youtubeLiveLink) => {

  // Take the current date and time and compute the time passed.
  const now = Date.now();
  const timePassed = now - cache.lastDateTimeQuery;

  // If the time passed exceeds the cache settings a new query
  // has to be made.
  if (timePassed > cache.intervalForChecking) {
    // First check is for the existing promise as another api 
    // call may have triggered it first. In that case we just
    // await for it to finish.
    if (uniquePromise !== null) {
      await uniquePromise;
    } else {
      // Nobody triggered this so we go ahead and do it as part
      // of the current call.
      uniquePromise = queryYoutube(youtubeLiveLink);
      await uniquePromise;

      // Make sure we reset this to null so that next calls won't
      // believe there is still an unfinished promise.
      uniquePromise = null;
    }
    cache.lastDateTimeQuery = now;
  }
  const response = {
    isLive: cache.isLive,
    url: cache.url
  }
  return response;
}

module.exports = { getLiveStatus }
