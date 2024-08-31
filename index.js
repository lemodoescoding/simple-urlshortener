require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConn');
const { makeUrlShort, convertUrlShort } = require('./controllers/urlShortenerController');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next();
})

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', makeUrlShort);
app.get('/api/shorturl/:id', convertUrlShort);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
