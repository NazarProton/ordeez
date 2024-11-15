const config = require('../config');
const { Ordinalsbot } = require('ordinalsbot');

const ordinalsbot = new Ordinalsbot(
    config.ordinalsbot.apiKey,
    config.ordinalsbot.env
);

module.exports = {
    ordinalsbot
};
