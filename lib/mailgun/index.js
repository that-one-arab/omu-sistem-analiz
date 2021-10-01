
/**
 * @todo I need to change the domain field, I'll either verify a new domain for Mailgun, or work on implementing my own email service in my amazon instance
 */
const dotenv = require('dotenv');
const mailgunapi = require("mailgun-js");

dotenv.config();
process.env.MAILGUN_API_KEY;

const DOMAIN = 'info.obexport.com';
const mailgun = mailgunapi({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN, host: "api.eu.mailgun.net"});

module.exports = mailgun