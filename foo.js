import cron from 'node-cron'
import fs from 'fs'

cron.schedule('* * * * *', () => {
  const CreateFiles = fs.createWriteStream('./bar.txt', {
        flags: 'a' //flags: 'a' preserved old data
  })

  const now = Date.now()
  let today = new Date(now)
  today = today.toISOString()
  // today = today.split('T')[0] // cut off time
  CreateFiles.write(today+'\r\n') //'\r\n at the end of each value
})
