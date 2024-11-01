const express = require('express');
const fs = require('fs');
const ini = require('ini');
const cors = require('cors');


const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const port = config.server.port;

const app = express();
const Cors = cors({origin: 'http://localhost:3000',})
app.use(Cors);

// logger
// static file
// http2
// body parser
// encrypton
// env var


app.get('/v1/', (req, res) => {
  res.status(200).send(`Server is running on port ${port}`);
});

// app.use('/v1',);

// all others case handler

app.use((error, req, res, next) => {
	console.error(error);
})

const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    // debug('HTTP server closed')
  })
})