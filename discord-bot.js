const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token, guildId, eventGeneralId } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	try {
		const guild = await client.guilds.fetch(guildId);
		const eventGeneral = await guild.channels.fetch(eventGeneralId);
		if (guild.available === false) return;


		let event = await guild.scheduledEvents.create({
			channel: eventGeneral,
			description: "Raid of the Week",
			name: "Raid of the Week",
			scheduledStartTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
            scheduledEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
			entityType: 3,
			privacyLevel: 2,
			entityMetadata: {
				location: "Gielinor"
			}
		});

		console.log(`🎉 Event created: ${event.name} (ID: ${event.id}), description: ${event.description}`);
		
	}
	catch(error) {

	}
});

// Log in to Discord with your client's token
client.login(token); 

client.commands = new Collection(); 

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});