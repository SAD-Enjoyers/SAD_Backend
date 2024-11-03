const express = require('express');
const fs = require('fs');
const ini = require('ini');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./logger');
const router = require('./routes/routes')

const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const port = config.server.port;

const app = express();
const Cors = cors({origin: 'http://localhost:3000',})
app.use(Cors);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
	logger.info(`Request: ${req.method}, ${req.url}`);
	next();
});

app.get('/api/v1/', (req, res) => {
	res.status(200).send(`Server is running on port ${port}`);
});

app.use('/api/v1', router);

app.use((req, res, next) => {
	res.status(404).send(
		{status: 404, message: 'Route not found',requestedUrl: req.originalUrl});
});


app.use((err, req, res, next) => {
	logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
	res.status(500).send('Something went wrong!');
});

const server = app.listen(port, () => {
		console.log(`Server started on port ${port}`);
});

process.on('SIGTERM', () => {
	console.log('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		console.log('HTTP server closed');
		// debug('HTTP server closed');
	});
});
