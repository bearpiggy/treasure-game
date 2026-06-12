const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/scores', require('../server/routes/scores'));

module.exports = app;
