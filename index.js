/*
 *
 * Vorsicht, git push dokku main
 * geht nicht mehr, warum?
 * workaround: git push origin main, dann auf minipanda:
 * dokku git:sync stupibot https://github.com/cas-dt/stupi-discord-bot main
 *
 * pro memoria: add bot to server
 * https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links
  *
  */

const cron = require('node-cron')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const { Client, Intents } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

dotenv.config()

// env vars
const env = process.env.ENV
const botToken = process.env.botToken
const clientId = process.env.clientID
const guildId = process.env.guildID
const casdtGuildId = process.env.casdtGuildID
const channelIdLila = process.env.lilaID
const channelIdPink = process.env.pinkID
const c4taServer = process.env.c4taGuildID
const c4taAllgemein = process.env.c4taAllgemein

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

function getTodaysDate() {
  // returns date as string
  // today = '2022-04-09'
  const now = Date.now()
  let today = new Date(now)
  today = today.toISOString()
  today = today.split('T')[0] // cut off timestamp
  return today
}

function openingEmojis() {
  const openingEmojis = ['👾','😎','🥳','👻','🥐','🤖','😻','😹','🐼','🐶','🐯','🐞','🦁','🐭','🪲','🦋','🦉','🐡','🐠','🦑','🐙','🐢','🐳','🐿','🦔','🌴','🍄','🌳','🍎','🍏','🍊','🍋','🍉','🍇','🥨','🍔','🌭','🚀','🚂','⛵️','🚒']
  const opEmo = openingEmojis[Math.trunc(Math.random() * openingEmojis.length)]
  return opEmo
}
        
function closingEmojis() {
  const closingEmojis = ['🌈','☀️','🎈','🌻','✨','🍹','🌸','⭐️','💐']
  const clEmo = closingEmojis[Math.trunc(Math.random() * closingEmojis.length)]
  return clEmo
}

/* Geburi Christine */
cron.schedule('0 7 18 5 *', () => {
  const client = new Client({ intents: ['GUILD_MESSAGES']})
  client.destroy() // logout
  client.login(botToken)
  client.once('ready', async () => {
    // console.log('🤖 Stubibot ready for congratulating.')
    const allgChannel = await client.channels.fetch(process.env.wbAllgemein)
    const intro = ['👾','🥳','👻','🥐','🤖','🐯','🐞','🦔','⛵️'];
    const introEmo = intro[Math.trunc(Math.random() * intro.length)]
    const outro = ['🌈','☀️','🌻','✨','💐']
    const outroEmo = outro[Math.trunc(Math.random() * outro.length)]
    allgChannel.send(`${introEmo} Alles Gute zum Geburtstag, Christine! ${outroEmo}` )
  })
})

/* Geburi Roland */
cron.schedule('0 7 18 6 *', () => {
  const client = new Client({ intents: ['GUILD_MESSAGES']})
  client.destroy() // logout
  client.login(botToken)
  client.once('ready', async () => {
    const allgChannel = await client.channels.fetch(process.env.wbAllgemein)
    const intro = ['👾','🤖','🎈','🐞','🦔'];
    const introEmo = intro[Math.trunc(Math.random() * intro.length)]
    const outro = ['🌈','☀️','🌻']
    const outroEmo = outro[Math.trunc(Math.random() * outro.length)]
    allgChannel.send(`${introEmo} Bzzzt! Ein Robotergruss zum Geburtstag, Roland! ${outroEmo}` )
  })
})

// Stundenplan c4ta
cron.schedule('0 6 * * MON', () => {
  // At 08:00 on Monday

  const client = new Client({ intents: ['GUILD_MESSAGES']})

  client.destroy() // logout
  client.login(botToken)
  client.once('ready', async () => {
    console.log(' Stupibot ready for c4ta')

    // parse JSON string to JSON object
    const request = async () => {
      const response = await fetch('https://c4ta-curriculum.herokuapp.com/api/')
      const schooldays = await response.json()
      return schooldays
    }

    const c4ta_curriculum = await request()
    const c4ta_channel = await client.channels.fetch(c4taAllgemein)

    const today = getTodaysDate()
    console.log(today)
    const classMonday = c4ta_curriculum.find(schoolday => schoolday.date === today)
    console.log(classMonday)

    if (classMonday) { // today is a schoolday!
      const opEmo = openingEmojis()
      const clEmo = closingEmojis()
      const teacher = classMonday.teacher.name
      const title = classMonday.title
      const room = classMonday.room
      c4ta_channel.send(`${opEmo} Guten Morgen ${opEmo}\r\nDas Programm heute:\r\n${title} mit ${teacher}\r\nin ${room} ${clEmo}`) 
    }
  })
})

// Stundenplan CAS DT
cron.schedule('0 6 * * FRI,SAT', () => { // 6 Uhr ist wohl 8 Uhr Sommerzeit hier?
  // https://crontab.guru
  // At 08:00 on Friday and Saturday.
  // is it a school day?

  const client = new Client({ intents: ['GUILD_MESSAGES']})

  client.destroy() // logout
  client.login(botToken)

  client.once('ready', async () => {
    console.log('🤖 Stubibot ready for cas dt')

    // parse JSON string to JSON object
    const request = async () => {
      const response = await fetch('https://minipanda.ch/api/2022')
      const weekends = await response.json()
      return weekends
    }

    const casdt_curriculum = await request()

    const channelPink = await client.channels.fetch(channelIdPink);
    const channelLila = await client.channels.fetch(channelIdLila);

    const today = getTodaysDate()

    const classWeekend = casdt_curriculum.find(weekend => weekend.friday.date === today || weekend.saturday.date === today)

    if (classWeekend) {
      let classDay // fill receive day’s info, but is it friday or saturday?
      for (let day in classWeekend) { // either friday or saturday
        if (classWeekend[day].date == today) {
          classDay = classWeekend[day]
        }
      }
      classDay.classes.forEach(cla => {
        let channel = cla.name === 'pink' ? channelPink : channelLila
        const opEmo = openingEmojis()
        const clEmo = closingEmojis()
        const title = `**${cla.morning.title}**`
        const teacher = cla.morning.teacher
        const room = `Zimmer \`${cla.room}\``
        if (cla.postponed) {
          channel.send(`🚧 Guten Morgen 🚧\r\n${title} mit ${teacher}\r\nfällt aus. Weitere Infos folgen. 🛠` )
        } else {
          channel.send(`${opEmo} Guten Morgen ${opEmo}\r\nDas Programm heute:\r\n${title} mit ${teacher}\r\nin ${room} ${clEmo}`)
        }

        // console.log(`Klasse «${cla.name}» – Info sent to Channel`)
      })
    } else {
      console.log('no class this weekend')
    }
    console.log('🤖 Stubibot done')
  })

}) // end cron job
