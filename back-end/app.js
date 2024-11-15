require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();
const cors = require('cors');

app.server = require('http').createServer(app); // eslint-disable-line

app.options('*', cors());
app.use(cors());
// Wide-open CORS configuration (change before this is considered production-ready)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.use(require('body-parser').urlencoded({ limit: '50mb', extended: true }));
app.use(require('body-parser').json({ limit: '50mb' }));
app.use(require('cookie-parser')());
app.use(require('express-ip')().getIpInfoMiddleware);

app.use(express.static(path.join(__dirname, '/public'))); //eslint-disable-line

module.exports = app;
