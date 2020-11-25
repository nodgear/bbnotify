const dotenv = require('dotenv');
const Discord = require('discord.js');
const config = require('../config/discord.json');
const Logger = require('./logger.js');

dotenv.config();
const webhookClient = new Discord.WebhookClient(config.discordHookID, config.discordToken);


module.exports = function(array, title, description, tag, color)  {
    Logger.log(`Building discord embed for ${title}`)

    let fields = [];
    for (let i =0; i < array.length; i++){
      fields.push(
          { name: "Matéria", value: array[i].course, inline: true },
          { name: "Título", value: array[i].title, inline: true },
          { name: "Entrega", value: array[i].delivery, inline: true }
        )
    };

    let embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(color || '#f45000')
    .setAuthor(config.discordName, config.institutionLogo)
    .setTimestamp()
    .setThumbnail(config.discordPictures[Math.floor(Math.random() * config.discordPictures.length)])
    .setFooter('BBNotify by Nodge#0001')
    .addFields( fields )
    .setURL(process.env.SOURCE + '/')


    webhookClient.send(tag ? '@everyone' : '', {
      username: 'UniFTC',
      avatarURL: config.institutionLogo,
      embeds: [embed]
    });

};
