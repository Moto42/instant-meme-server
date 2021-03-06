const express = require('express');
const app = express();
const instantMeme = require('instant-meme');

app.use( express.static('frontend'));
app.use('/instant-meme', express.static('instant-meme'));
app.use(instantMeme);

module.exports = app;