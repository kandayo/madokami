const { Pool } = require('pg')
const pg = new Pool()

module.exports = {
  query: (text, params, callback) => {
    return pg.query(text, params, callback)
  },
  packets: () => {
    return pg.query('select * from packets;')
  },
  packetsCount: () => {
    return pg.query(`select reltuples::bigint as count from pg_class where relname = 'packets';`)
  },
  dbSize: () => {
    return pg.query(`select pg_size_pretty(pg_database_size('akane'));`)
  }
}
