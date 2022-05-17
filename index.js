/*
 * TODO
 * ====
 * [x] set up nodemon
 * [x] install latest node on minipanda
 * [x] api call curriculum
 * [x] test real data
 * [x] change timing
 * [x] add bot to CAS DT Discord server
 * [x] check for env var conflicts: botToken, guildID, clientID
 * [x] add bot to dokku
 * [x] pink/lila channels
 *
 * Vorsicht, git push dokku main
 * geht nicht mehr, warum?
 * workaround: git push origin main, dann auf minipanda:
 * dokku git:sync stupibot https://github.com/cas-dt/stupi-discord-bot main
 *
 * add bot to server:
 * https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links
  * */
const cron = require('node-cron')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const { Client, Intents } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

dotenv.config()
const env = process.env.ENV
const botToken = process.env.botToken
const clientId = process.env.clientID
const guildId = process.env.guildID
const casdtGuildId = process.env.casdtGuildID
// das muss env werden
const channelIdLila = process.env.lilaID
const channelIdPink = process.env.pinkID

/*
cron.schedule('j 8 * * FRI,SAT', () => {
}
const typeBrandClient = new Client({ intents: ['GUILD_MESSAGES']})
typeBrandClient.login(botToken)
typeBrandClient.once('ready', async () => {
  const zeitRaumChan = await typeBrandClient.channels.fetch(process.env.zeitRaum);
  zeitRaumChan.send('Stupibot Test Nr. 2 🤖')
})
*/
// test für type brand, bzw. bottest casdt

/* Geburi Christine*/
cron.schedule('0 6 5 5 *', () => {
  const client = new Client({ intents: ['GUILD_MESSAGES']})
  client.destroy() // logout
  client.login(botToken)
  client.once('ready', async () => {
    console.log('🤖 Stubibot ready for congratulating.')
    const testChannel = await client.channels.fetch(process.env.wbAllgemein)
    const now = Date.now()
    let today = new Date(now)
    today = today.toISOString()
    today = today.split('T')[1] // cut off date
    testChannel.send(`Ist es 8 Uhr oder was?` )
  })
})

// cron.schedule('* * * * *', () => {
cron.schedule('0 6 * * FRI,SAT', () => { // 6 Uhr ist wohl 8 Uhr Sommerzeit hier?
  // https://crontab.guru
  // At 08:00 on Friday and Saturday.
  // is it a school day?

  const client = new Client({ intents: ['GUILD_MESSAGES']})

  client.destroy() // logout
  client.login(botToken)

  client.once('ready', async () => {
    console.log('🤖 Stubibot ready')

    // parse JSON string to JSON object
    const request = async () => {
      const response = await fetch('https://minipanda.ch/api')
      const weekends = await response.json()
      return weekends
    }

    const curriculum = await request()

    const channelPink = await client.channels.fetch(channelIdPink);
    const channelLila = await client.channels.fetch(channelIdLila);

    const now = Date.now()
    let today = new Date(now)
    today = today.toISOString()
    today = today.split('T')[0] // cut off timestamp
    // fake it
    // today = '2022-04-09'

    const classWeekend = curriculum.find(weekend => weekend.friday.date === today || weekend.saturday.date === today)

    if (classWeekend) {
      let classDay // fill receive day’s info, but is it friday or saturday?
      for (let day in classWeekend) { // either friday or saturday
        if (classWeekend[day].date == today) {
          classDay = classWeekend[day]
        }
      }
      classDay.classes.forEach(cla => {
        let channel = cla.name === 'pink' ? channelPink : channelLila
        const openingEmojis = ['👾','😎','🥳','👻','🥐','🤖','😻','😹','🐼','🐶','🐯','🐞','🦁','🐭','🪲','🦋','🦉','🐡','🐠','🦑','🐙','🐢','🐳','🐿','🦔','🌴','🍄','🌳','🍎','🍏','🍊','🍋','🍉','🍇','🥨','🍔','🌭','🚀','🚂','⛵️','🚒'];
        const opEmo = openingEmojis[Math.trunc(Math.random() * openingEmojis.length)]
        const closingEmojis = ['🌈','☀️','🎈','🌻','✨','🍹','🌸','⭐️','💐']
        const clEmo = closingEmojis[Math.trunc(Math.random() * closingEmojis.length)]
        const title = `**${cla.morning.title}**`
        const teacher = cla.morning.teacher
        const room = `Zimmer \`${cla.room}\``
        channel.send(`${opEmo} Guten Morgen ${opEmo}\r\nDas Programm heute:\r\n${title} mit ${teacher}\r\nin ${room} ${clEmo}` )

        console.log(`Klasse «${cla.name}» – Info sent to Channel`)
      })
    } else {
      console.log('no class this weekend')
    }
    console.log('🤖 Stubibot done')
  })

}) // end cron job
