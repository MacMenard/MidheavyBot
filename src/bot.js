//make ".env file for "discord token id and webhooks"
require("dotenv").config(); 

//import discord.js and add Client to use discord api 
const { Client, WebhookClient } = require('discord.js'); 

//create bot class
const bot = new Client({
  partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN,
);

//set cmd prefix or add more and additional if you like
const PREFIX = "$";

//login message for bot login (see last line to see bot login)
bot.on('ready', () => {
  console.log(`${bot.user.tag} has logged in.`);
});

// https://discord.js.org/#/docs/main/stable/class/Message
bot.on('message', async (message) => {
  //im not sure about this line
  if (message.author.bot) return;
  // to start with your prefix and cleaning up what comes after to unsure no silly business with inaccurate typing
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
      //making kick command 
    if (CMD_NAME === 'kick') {
      if (!message.member.hasPermission('KICK_MEMBERS'))
        return message.reply('You do not have permissions to use that command');
      if (args.length === 0)
        return message.reply('Please provide an ID');
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) => message.channel.send('I cannot kick that user :('));
      } else {
        message.channel.send('That member was not found');
      }
    } else if (CMD_NAME === 'ban') {
      if (!message.member.hasPermission('BAN_MEMBERS'))
        return message.reply("You do not have permissions to use that command");
      if (args.length === 0) return message.reply("Please provide an ID");
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send('User was banned successfully');
      } catch (err) {
        console.log(err);
        message.channel.send('An error occured. Either I do not have permissions or the user was not found');
      }
    } else if (CMD_NAME === 'announce') {
      console.log(args);
      const msg = args.join(' ');
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});

bot.on('messageReactionAdd', (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === '861250322869780530') {
    switch (name) {
      case '⭐':
        member.roles.add('861252788456914995');
        break;
      case '🐍':
        member.roles.add('861252845718601828');
        break;
      case '💻':
        member.roles.add('861252892329246770');
        break;
      case '☕':
        member.roles.add('861252957995663411');
        break;
    }
  }
});

bot.on('messageReactionRemove', (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === '861250322869780530') {
    switch (name) {
      case '⭐':
        member.roles.remove('861252788456914995');
        break;
      case '🐍':
        member.roles.remove('861252845718601828');
        break;
      case '💻':
        member.roles.remove('861252892329246770');
        break;
      case '☕':
        member.roles.remove('861252957995663411');
        break;
    }
  }
});



//login the bot use discord token key
bot.login(process.env.DISCORDJS_BOT_TOKEN);

// console.log(process.env.DISCORDJS_BOT_TOKEN);

