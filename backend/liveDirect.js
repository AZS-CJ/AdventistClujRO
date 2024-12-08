const undici = require('undici');

// Keep the value in a cache object, so that we don't ask Youtube
// each time an api call comes in
const cache = {
  // The last time is initialized with 1.1.1970
  lastDateTimeQuery: new Date(0),

  // We consider the default value to be false
  isLive: false,

  // We check the live status maximum one time per minute
  intervalForChecking: 6000 // ms
};

const API_KEY = process.env.YT_API_KEY;


// The unique promise is needed so that concurrent api calls
// do no trigger multiple youtube queries. One query is enough.
var uniquePromise = null;

const getYoutubeIdUsingFriendlyName = async (friendlyName) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${friendlyName}&key=${API_KEY}`;
    const { statusCode, body } = await undici.request(url);

    if (statusCode !== 200) {
      console.error(`API request failed with status: ${statusCode}`);
      return null;
    }

    const data = await body.json();

    if (data.items && data.items.length > 0 && data.items[0].id) {
      return data.items[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error getting channel ID:', error);
    return null;
  }
}

// The 'magic' query happens here where we get the youtube page
// as plain html. If the live is on then the canonical link is different.
const queryYoutube = async (channelFriendlyName) => {

  const channelId = await getYoutubeIdUsingFriendlyName(channelFriendlyName);

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${API_KEY}`;

  try {
    const { statusCode, body, trailers, context } = await undici.request(url);

    const data = await body.json();

    if (statusCode !== 200) {
      console.error(`API request failed with status: ${statusCode}`);
      return;
    }

    if (data.items && data.items.length > 0) {
      console.log('The channel is live!');
      cache.isLive = true;
      cache.url = data.items[0].id.videoId;
    } else {
      console.log('The channel is not live.');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

const getLiveStatus = async (channelFriendlyName) => {

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
      uniquePromise = queryYoutube(channelFriendlyName);
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
