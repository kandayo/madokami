const cache = require('express-redis-cache')()
const express = require('express')
const path = require('path')
const pg = require('./database')
const Table = require('easy-table')

express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'hbs')
  .use(cache.route(2000))
  .get('/', async (req, res) => {
    const packets = await pg.packets()
    const packetsSize = await pg.packetsCount()
    const dbSize = await pg.dbSize()

    const table = new Table()

    packets.rows.forEach((packet) => {
      table.cell('Event', packet.name)
      table.cell('Count', Number(packet.times))
      table.newRow()
    })

    res.render('index', {
      table: table.print(),
      dispatches: Number(packetsSize.rows[0]['count']).toLocaleString(),
      dbSize: dbSize.rows[0]['pg_size_pretty']
    })
  })
  .use((req, res, next) => {
    res.status(404).render('404')
  })
  .listen(3000)
