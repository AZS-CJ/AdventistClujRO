const express = require('express');
const path = require('path');
const app = express();

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api', function(req, res) { 
  res.send('{"api": "works"}');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(normalizePort(process.env.PORT || '3000'));

console.log(`Server started on port ${process.env.PORT}`);
