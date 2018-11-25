const cache = require('express-redis-cache')()
const express = require('express')
const path = require('path')
const pg = require('./database')

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'hbs')
  .use(cache.route(2000))
  .get('/', async (req, res) => {
    const msgStats = await pg.msgToday()
    const dispatches = await pg.dispatchesCount()
    const dbSize = await pg.dbSize()

    res.render('index', {
      values: msgStats.rows[0]['array'],
      dispatches: Number(dispatches.rows[0]['count']).toLocaleString(),
      dbSize: dbSize.rows[0]['pg_size_pretty']
    })
  })
  .use((req, res, next) => {
    res.status(404).render('404')
  })
  .listen(3000)
