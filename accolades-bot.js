// Replace with your bot token
const { token, guildId, eventGeneralId } = require('./config.json');

const eventData = {
  name: "Raid of the Week",
  privacy_level: 2, // GUILD_ONLY
  scheduled_start_time: "2026-11-01T18:00:00Z",
  scheduled_end_time: "2026-11-01T20:00:00Z",
  entity_type: 3, // EXTERNAL
  entity_metadata: {
    location: "Gielinor"
  },
  description: "Raid of the Week"
};

/*//https://accolades.apps.bot-hosting.cloud/createEvent?name=Raid%20of%20the%20Week&scheduled_start_time=2026-11-01T18:00:00Z&scheduled_end_time=2026-11-01T20:00:00Z
app.get('/p/:tagId', function(req, res) {
  res.send("tagId is set to " + req.param("tagId"));
});
*/

fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events`, {
  method: "POST",
  headers: {
    "Authorization": `Bot ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(eventData)
})
.then(res => res.json())
.then(data => console.log("Event created:", data))
.catch(err => console.error("Error:", err));