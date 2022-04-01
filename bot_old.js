// Stupi Stundenplan Bot

/*
const secret = "D6GpXHqzrlQT06lw7kPMcknBFiCrtcle"
const appID = "954319800258146334"
const publicKey = "a96b70b8acd007c8c701b3c4c45241c1034a2ecdadcd3096ed12b24643bc6ebd"
 https://discord.com/oauth2/authorize?client_id=954319800258146334&scope=bot
*/

const cron = require('node-cron')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const Discord = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
dotenv.config()

/*
// parse JSON string to JSON object
const request = async () => {
  const response = await fetch('https://minipanda.ch/api')
  const weekends = await response.json()
  //console.log(weekends)
  weekends.forEach(weekend => {
    for (let day in weekend) {
      const today = weekend[day]
      const niceDate = new Date(today.date).toLocaleDateString(
        'de-CH'
      )
      console.log(`${day === 'friday' ? 'Freitag' : 'Samstag'}, ${niceDate}`)
      for (let cla of today.classes) {
        const name = cla.name
        const room = cla.room.length ? cla.room.length : 'Y.000'
        const title = cla.morning.title
        const teacher = cla.morning.teacher
        console.log(`Klasse «${name}»`)
        console.log(`${title}, ${teacher}`)
        console.log(`Zimmer: ${room}`)
        console.log('=')
      }
    }
  })
}
request()
*/

/* env variables set in dokku:
dokku config:set auction ENV=prod MAILPASS=x#px@x! GEHEIMNIS="Bla\ bla\ bla,\ bla.\ Jodok"
*/

const botToken = process.env.botToken
// const client = new Discord.Client()

/*
client.login(botToken)
client.on('ready', readyDiscord)
*/

/*
function readyDiscord() {
  // console.log('💐')
  const channelId = 958843538450313276
  const channel = client.channels.cache.get(channelId);
  channel.send('foo');
  console.log('sent foo to channel')
}
*/

// 958843538450313276 <— Channel ID (bottest)
// SEND_MESSAGES

/*
cron.schedule('* * * * *', () => {
  // https://crontab.guru
  // 0 8 * * FRI,SAT
  // At 08:00 on Friday and Saturday.
  // is it a school day?
})
*/
