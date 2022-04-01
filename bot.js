/*
 * todo
 * - set up nodemon
 * - better start script (node version)
 * - install latest node on minipanda
 * - api call curriculum
 * - test real data
  * */
const cron = require('node-cron')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const { Client, Intents } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const testData = [
  {
    date: "2022-04-01",
    classes: [
      {
        name: "apples",
        title: "foo hello"
      },
      {
        name: "oranges",
        title: "onkel jodok lässt grüssen"
      }
    ]
  },
  {
    date: "2022-04-02",
    classes: [
      {
        name: "apples",
        title: "yo yo hello"
      },
      {
        name: "oranges",
        title: "onkel buzi lässt grüssen"
      }
    ]
  }
]


cron.schedule('* * * * *', () => {
  dotenv.config()
  const botToken = process.env.botToken
  const clientId = process.env.clientID
  const guildId = process.env.guildID
  const channelId1 = '958843538450313276'
  const channelId2 = '959531185892122634'

  const client = new Client({ intents: ['GUILD_MESSAGES']})

  client.destroy() // logout
  client.login(botToken)

  client.once('ready', async () => {
    console.log('🤖 Stubibot ready')

    const channel1 = await client.channels.fetch(channelId1);
    const channel2 = await client.channels.fetch(channelId2);

    const now = Date.now()
    let today = new Date(now)
    today = today.toISOString()
    today = today.split('T')[0] // cut off timestamp

    const todayClasses = testData.find(day => day.date === today)
    console.log(`today: ${today}`)
    console.log(`todayClasses.date: ${todayClasses.date}`)
    if (todayClasses) {
      const classes = todayClasses.classes
      const message1 = `Klasse: ${classes[0].name}\r\nTitel: ${classes[0].title}`
      const message2 = `Klasse: ${classes[1].name}\r\nTitel: ${classes[1].title}`
      channel1.send(message1)
      channel2.send(message2)
    }


    console.log('🤖 Stubibot done')
  })

})
