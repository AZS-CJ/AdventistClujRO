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
  const answer = await undici.request(youtubeLiveLink);
  const plainText = await answer.body.text();
  const html = htmlParser.parse(plainText);
  const urlTag = html.querySelector('link[rel=canonical]');
  const url = urlTag.getAttribute('href');
  cache.isLive = url.includes('/watch?v=');
  cache.url = url;
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
