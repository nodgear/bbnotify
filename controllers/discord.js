const dotenv = require('dotenv');
const Discord = require('discord.js');

dotenv.config();
const webhookClient = new Discord.WebhookClient(process.env.DISCORDHOOK, process.env.DISCORDTOKEN);

let discordController = {
  buildEmbed : function (array, title, description, color) {

    let fields = [];

    let hook = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(color || '#f45000')
    .setAuthor("Nodge")
    .setTimestamp()
    .setThumbnail('https://i.imgur.com/0nbLwdq.png')
    .setFooter('Botentinha BlackBoard :)')
    .setURL = ("https://ftc.blackboard.com/ultra/stream")

    for (let i =0; i < array.length; i++){
        fields.push(
            { name: "Matéria", value: array[i].course, inline: true },
            { name: "Título", value: array[i].title, inline: true },
            { name: "Entrega", value: array[i].delivery, inline: true }
        )
    };

    return hook

  },

  sendWebhook: function(embed, tag) {
    webhookClient.send(tag? '@everyone' : '', {
      username: 'Botentinha',
      avatarURL: 'https://i.imgur.com/0nbLwdq.png',
      embeds: [embedToDeliver]
  });
  
  }


}


module.exports = discordController;