const express = require('express');
const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const port = config.server.port;

const app = express();

app.get('/', (req, res) => {
  res.status(200).send(`Server is running on port ${port}`);
});

app.listen(config.server.port, () => {
	console.log(`Server started on port ${port}`);
});
