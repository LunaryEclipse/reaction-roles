const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("join discord.gg/lunary for help!")
})

app.listen(3000, () => {
  console.log("bot online!")
})




let Discord = require("discord.js")
const client = new Discord.Client
const { Collection } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { Client } = require('discord.js');
const db = require('quick.db')



const fetch = require("node-fetch")

const activities_list = 
    [
    "Involved in Car Chase in GTA V RP", 
    "Giving Karen a Cheeky Slap",
    "Trolling 8 y/o on COD MWR", 
    "@here Pings!!",
    "Coding myself...",
    "Making a Music",
    "YEET-ing Someone",
    "Watching You.",
    "IDLE",
    "Pinging @everyone",
    "Watching NetFlix",
    "Someone Trippin'",
    "Watching custom prefixes",
     "Lunary made me",
    `Yay i'm on ${client.guilds.cache.size} Guilds`,
    ]; // creates an arraylist containing phrases you want your bot to switch through.

const status_list = 
    [
      "online",
      "dnd",
      "idle"
    ];
client.on('ready', () => 
{
    setInterval(() => 
    {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
        const index2 = Math.floor(Math.random() * (status_list.length - 1) + 1);
        client.user.setPresence({ activity: { name: `${activities_list[index]}` }, status: `${status_list[index2]}`})
    }, 10000); // Runs this every 60 seconds. [ 60s=1m ]
});

client.on('ready', async function() {
  console.log(`Hi, ${client.user.username} is now online! ` +  client.user.tag + " is currently in " + client.guilds.cache.size + " servers " + ",watching " +
                        `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}` + " people");
});


client.on("message", async message => {


  if(message.content.startsWith (".reaction")) {
    const args = message.content.split(" ");
    if(!args[1]) return message.channel.send("Please include an emoji");
    if(!args[2]) return message.channel.send("There must be an id for the message");
    if(isNaN(args[2])) return message.channel.send("Please include a valid message id");
    if(!args[3]) return message.channel.send("Please include the id of the role ID");
    if(isNaN(args[3])) return message.channel.send("Please include a valid ID for the role that should be given upon reaction.");
    let emoji = ReactionEmojiGrab(args[1]);
    if(!isNaN(emoji)) emoji = client.emojis.cache.get(emoji);
    try{
      const msg = await message.channel.messages.fetch(args[2]);
      await msg.react(emoji);
      
      db.push(`${message.guild.id}.reactionroles`, 
        {
          message: msg.id,
          emoji: emoji.id || emoji,
          role: args[3]
        }
      );
    }catch(e){
      message.channel.send("Error\n" + e);
    }
  }


})

client.on("messageReactionAdd", (reaction, user) => {
  if(user.bot) return;
  const reactionRoles = db.get(`${reaction.message.guild.id}.reactionroles`);
  if(!reactionRoles) return;
  reactionRoles.forEach(async reactionRole => {
    if((reactionRole.emoji === reaction._emoji.name || reactionRole.emoji == reaction._emoji.id) && reactionRole.message == reaction.message.id){
      try{
        await reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole.role)
      }catch(e){
        console.log(e);
      }
    }
  });
})

client.on("messageReactionRemove", (reaction, user) => {
  if(user.bot) return;
  const reactionRoles = db.get(`${reaction.message.guild.id}.reactionroles`);
  if(!reactionRoles) return;
  reactionRoles.forEach(async reactionRole => {
    if((reactionRole.emoji === reaction._emoji.name || reactionRole.emoji == reaction._emoji.id) && reactionRole.message == reaction.message.id){
      try{
        await reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole.role)
      }catch(e){
        console.log(e);
      }
    }
  });
})

function ReactionEmojiGrab(reactionArg){
  const contents = reactionArg.substring(1, reactionArg.length - 1).split(":");
  if(contents.length > 1){
    return contents[2];
  }else{
    return reactionArg;
  }
}

client.login("yourtoken")
