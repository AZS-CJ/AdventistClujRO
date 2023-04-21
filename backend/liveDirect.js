const undici = require('undici');

const getLiveStatus = async () => {
  const answer = await undici.request('https://www.youtube.com/@AdventistCluj/live');

  const rj = await answer.body.text();

  console.log(rj);
}

module.exports = { getLiveStatus }