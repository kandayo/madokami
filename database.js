const { Pool } = require('pg')
const pg = new Pool()

module.exports = {
  query: (text, params, callback) => {
    return pg.query(text, params, callback)
  },
  msgToday: () => {
    return pg.query(`
      select array(
        select count(*) from dispatches
         where timestamp between now() - INTERVAL '24 HOURS' and now()
           and name = 'MESSAGE_CREATE'
         group by extract(hour from "timestamp")
      );
    `)
  },
  dispatchesCount: () => {
    return pg.query(`select reltuples::bigint as count from pg_class where relname = 'dispatches';`)
  },
  dbSize: () => {
    return pg.query(`select pg_size_pretty(pg_database_size('akane'));`)
  }
}
