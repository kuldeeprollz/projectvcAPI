const { Pool, Client } = require('pg')


var config = {
    user: 'mulakaat_user',
    host: '172.105.60.46',
    database: 'mulakaatDB',
    password: 'mulakaat@rollz',
    port: 5432,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000
}

//c
const pool = new Pool(config)



module.exports ={
     query: (text, params) => pool.query(text, params),

 }




  
