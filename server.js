const { token, guildId, eventGeneralId } = require('./config.json');
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 25330;


app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/createEvent', async (req, res) => {
    // res.send('Creating Event' + JSON.stringify(req.query));


    if (
        req.query.name
        && req.query.privacy_level
        && req.query.scheduled_start_time
        && req.query.scheduled_end_time
        && req.query.entity_type
    ) {
        const eventData = {
            name: req.query.name,
            privacy_level: req.query.privacy_level, // GUILD_ONLY
            scheduled_start_time: new Date(req.query.scheduled_start_time).toISOString(),
            scheduled_end_time: new Date(req.query.scheduled_end_time).toISOString(),
            entity_type: req.query.entity_type === '3' ? 3 : req.query.entity_type === '2' ? 2 : req.query.entity_type === '1' ? 1 : '', // EXTERNAL
            entity_metadata: {
                location: req.query.entity_metadata_location ? req.query.entity_metadata_location : "Gielinor"
            },
            description: req.query.description

        };
        try {
            //create the event in discord
            // res.send('1 Creating Event' + JSON.stringify(req.query));
            let res2 = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events`, {
                method: "POST",
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(eventData)
            }),
            data = await res2.json();


            //2 post the event information in #event-general using the discord bot
            const res3 = await fetch(`https://discord.com/api/v10/channels/${eventGeneralId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: 'https://discord.com/events/' + eventJustCreatedId + '\n\n@Events @1281049707665428552'
                })
            });

            res.send('Created discord event');
        }
        catch (error) {
            res.send('Error creating discord event');
            console.error("Error:", error);
        }

        
    }
    else {
        res.send('Not enough parameters to create event');
    }
});
app.listen(process.env.SERVER_PORT, "0.0.0.0")

