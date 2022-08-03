const dotenv = require('dotenv')
const { Client } = require('pg')

dotenv.config()
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD, NODE_ENV } =
  process.env

const client = new Client({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
})

// console.log(client)
;(async () => {
  await client.connect()
  const sql = 'select * from users'
  const result = await client.query(sql)
  // conn.release()
  console.log(result.rows)
})()
