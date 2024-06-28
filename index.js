// Dependencies
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const CatLoggr = require('cat-loggr');

const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Yo boi!!'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);
// Keep Alive

// Functions
const client = new Discord.Client();
const log = new CatLoggr();

// New discord collections
client.commands = new Discord.Collection();

// Logging
if (config.debug === true) client.on('debug', stream => log.debug(stream)); // if debug is enabled in config
client.on('warn', message => log.warn(message));
client.on('error', error => log.error(error));

// Load commands from folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Command directory
for (const file of commandFiles) {
	const command = require(`./commands/${file}`); // Load the command
    log.init(`Loaded command ${file.split('.')[0] === command.name ? file.split('.')[0] : `${file.split('.')[0]} as ${command.name}`}`); // Logging to console
	client.commands.set(command.name, command); // Set command by name to the discord "commands" collection
};

// Client login
client.login(process.env.TOKEN);
